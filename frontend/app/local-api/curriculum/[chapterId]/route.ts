import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy route that fetches chapter content from the Spring Boot backend.
 *
 * Previously this checked a hardcoded syllabusCatalog first and read
 * static markdown files from docs/curriculum/. That dual-source path
 * has been removed — the database (via CurriculumController) is now the
 * sole source of truth for chapter content.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  const { chapterId } = params;

  try {
    // Fetch chapter metadata
    const chapRes = await fetch(`http://localhost:8085/api/v1/curriculum/chapters/${chapterId}`);
    if (!chapRes.ok) {
      if (chapRes.status === 404) {
        return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
      }
      throw new Error(`Failed to fetch chapter. Status: ${chapRes.status}`);
    }
    const chapter = await chapRes.json();

    // Fetch topics
    const topicsRes = await fetch(`http://localhost:8085/api/v1/curriculum/chapters/${chapterId}/topics`);
    const topics = topicsRes.ok ? await topicsRes.json() : [];

    let combinedMarkdown = `# ${chapter.title}\n\n`;
    const topicsWithLessons = [];

    for (const topic of topics) {
      combinedMarkdown += `## ${topic.title}\n\n`;
      // Fetch concepts
      const conceptsRes = await fetch(`http://localhost:8085/api/v1/curriculum/topics/${topic.id}/concepts`);
      const concepts = conceptsRes.ok ? await conceptsRes.json() : [];
      const conceptsWithLessons = [];

      for (const concept of concepts) {
        // 1. Try to fetch new Lesson & ContentBlocks
        const lessonRes = await fetch(`http://localhost:8085/api/v1/curriculum/concepts/${concept.id}/lesson`);
        let lesson = null;
        if (lessonRes.ok) {
          lesson = await lessonRes.json();
          const blocks = lesson.contentBlocks || [];
          for (const block of blocks) {
            if (block.type === 'EXPLANATION' && block.metadata && block.metadata.text) {
              combinedMarkdown += `${block.metadata.text}\n\n`;
            }
          }
        } else {
          // 2. Fallback to legacy learning objects
          const loRes = await fetch(`http://localhost:8085/api/v1/curriculum/concepts/${concept.id}/learning-objects`);
          const los = loRes.ok ? await loRes.json() : [];
          for (const lo of los) {
            if (lo.contentPayload) {
              combinedMarkdown += `${lo.contentPayload}\n\n`;
            }
          }
        }

        conceptsWithLessons.push({
          id: concept.id,
          title: concept.title,
          lesson: lesson
        });
      }

      topicsWithLessons.push({
        id: topic.id,
        title: topic.title,
        concepts: conceptsWithLessons
      });
    }

    return NextResponse.json({
      title: chapter.title,
      markdownContent: combinedMarkdown,
      difficulty: "Intermediate",
      estimatedMinutes: 30,
      section: "Core Theory",
      isStatic: false,
      topics: topicsWithLessons
    });
  } catch (error: any) {
    console.error("Backend curriculum fetch failed:", error);
    return NextResponse.json({ error: "Backend fetch failed: " + error.message }, { status: 500 });
  }
}
