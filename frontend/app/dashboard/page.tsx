"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../config/AuthContext";
import { useCurriculumCatalog } from "../../hooks/useCurriculumCatalog";
import { useDomainCurriculumCatalog } from "../../hooks/useDomainCurriculumCatalog";

import WeeklyActivityChart from "../../components/dashboard/WeeklyActivityChart";
import StreakCalendar from "../../components/dashboard/StreakCalendar";
import FlashcardsDueWidget from "../../components/dashboard/FlashcardsDueWidget";
import AchievementGallery from "../../components/dashboard/AchievementGallery";
import LeaderboardPreview from "../../components/dashboard/LeaderboardPreview";
import QuizScoreChart from "../../components/dashboard/QuizScoreChart";
import ContinueLearningWidget from "../../components/dashboard/ContinueLearningWidget";
import SectionProgressCards from "../../components/dashboard/SectionProgressCards";
import PomodoroTimer from "../../components/lessons/PomodoroTimer";

interface ProgressItem {
  lessonId: string;
  completionPercentage: number;
  completed: boolean;
}

export default function DashboardPage() {
  const { token, user } = useAuth();
  const { subjects, totalChapters, loading: catalogLoading } = useCurriculumCatalog();
  const [profile, setProfile] = useState<any>(null);
  const [progressList, setProgressList] = useState<ProgressItem[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [dueCardsCount, setDueCardsCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [activityDays, setActivityDays] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    // Fetch profile stats
    const fetchProfile = fetch("/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json());

    // Fetch chapters completed progress
    const fetchProgress = fetch("/api/v1/progress", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json());

    // Fetch achievements list
    const fetchAchievements = fetch("/api/v1/achievements", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).catch(() => []);

    // Fetch leaderboard
    const fetchLeaderboard = fetch("/api/v1/leaderboard", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).catch(() => []);

    // Fetch flashcards due
    const fetchFlashcards = fetch("/api/v1/flashcards/due", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).catch(() => []);

    // Fetch weekly activity
    const fetchWeeklyActivity = fetch("/api/v1/sessions/activity", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).catch(() => []);

    // Fetch streak calendar
    const fetchStreakCalendar = fetch("/api/v1/analytics/streak", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).catch(() => ({}));

    Promise.all([fetchProfile, fetchProgress, fetchAchievements, fetchLeaderboard, fetchFlashcards, fetchWeeklyActivity, fetchStreakCalendar])
      .then(([profileData, progressData, achievementsData, leaderboardData, flashcardsData, weeklyDataResponse, streakData]) => {
        setProfile(profileData);
        setProgressList(progressData);
        setAchievements(achievementsData);
        setLeaderboard(leaderboardData);
        setDueCardsCount(flashcardsData.length || 0);
        
        // Use real data if available, otherwise fallback to mock for demonstration
        if (weeklyDataResponse && weeklyDataResponse.length > 0) {
          setWeeklyData(weeklyDataResponse);
        } else {
          setWeeklyData([]);
        }

        setActivityDays(streakData || {});
      })
      .catch(err => console.error("Error loading dashboard metrics", err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading || catalogLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 font-semibold animate-pulse uppercase tracking-widest text-xs">
          Loading Student Profile...
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <span className="text-4xl mb-4">🔒</span>
        <h2 className="text-xl font-bold text-white mb-2">Access Protected</h2>
        <p className="text-slate-400 text-sm max-w-sm mb-6">
          Please log in or register to view your custom healthcare curriculum progression, streaks, and spaced-repetition schedules.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/login" className="px-4 py-2 bg-blue-600 rounded text-white text-xs font-bold hover:bg-blue-500 transition">
            Log In
          </Link>
          <Link href="/auth/register" className="px-4 py-2 bg-slate-900 border border-slate-800 rounded text-slate-300 text-xs font-bold hover:bg-slate-800 transition">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  const xp = profile?.currentXp ?? 0;
  const streak = profile?.dailyStreak ?? 0;
  
  const completedChaptersCount = progressList.filter(p => p.completed).length;
  const completionRate = totalChapters > 0 ? Math.round((completedChaptersCount / totalChapters) * 100) : 0;

  // Weekly data is now fetched from the backend. Fallback handled in the chart component if empty.

  // Mock streak calendar mapping
  const streakData = Array.from({ length: 28 }).map((_, i) => ({
    date: `2026-07-${i + 1}`,
    active: i < streak || i % 5 === 0
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-900 pb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
              Welcome back, <span className="text-blue-400">{profile?.firstName || user?.email}</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">{profile?.enrolledProgram || 'MBBS'} Student Dashboard • Curriculum Progress</p>
            
            <div style={{ position: "relative", display: "inline-block", marginTop: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Current Program:</span>
                <span style={{ fontSize: "0.75rem", fontWeight: "bold", background: "rgba(59,130,246,0.1)", color: "#93c5fd", padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid rgba(59,130,246,0.2)" }}>
                  {profile?.enrolledProgram || 'MBBS'}
                </span>
                <Link href="/healthcare" style={{ fontSize: "0.75rem", color: "#60a5fa", textDecoration: "underline", marginLeft: "0.5rem" }}>
                  Change Program
                </Link>
              </div>
            </div>
          </div>
          <Link href="/subjects" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 transition rounded-lg text-xs font-bold text-white shadow-md shadow-blue-900/30 self-start">
            Browse Syllabus
          </Link>
        </header>

        {/* Top Level Summary Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* XP Widget */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full translate-x-8 -translate-y-8 blur-xl" />
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Total Experience</span>
              <span className="text-3xl font-black text-white">{xp} <span className="text-xs text-blue-400 font-bold">XP</span></span>
            </div>
            <span className="text-3xl">✨</span>
          </div>

          {/* Daily Streak */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full translate-x-8 -translate-y-8 blur-xl" />
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Daily Streak</span>
              <span className="text-3xl font-black text-white">{streak} <span className="text-xs text-orange-400 font-bold">days</span></span>
            </div>
            <span className="text-3xl">🔥</span>
          </div>

          {/* Syllabus Progress */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8 blur-xl" />
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Course Progress</span>
              <span className="text-3xl font-black text-white">{completionRate}%</span>
              <span className="text-[10px] text-slate-400 font-medium block mt-1">({completedChaptersCount} of {totalChapters} chapters)</span>
            </div>
            <span className="text-3xl">🏆</span>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Left Column (Main Analytics) */}
          <div className="lg:col-span-2 space-y-6">
            <WeeklyActivityChart data={weeklyData} />
            <QuizScoreChart data={[]} />
            <AchievementGallery achievements={achievements} />
          </div>

          {/* Right Column (Secondary Info) */}
          <div className="space-y-6">
            <ContinueLearningWidget progressList={progressList} subjects={subjects} />
            <FlashcardsDueWidget dueCount={dueCardsCount} />
            <SectionProgressCards progressList={progressList} subjects={subjects} />
            <StreakCalendar activityDays={activityDays} />
            <LeaderboardPreview entries={leaderboard} currentUserId={profile?.id} />
          </div>

        </div>

        {/* Tracked Chapters List */}
        <section className="bg-slate-900/20 border border-slate-900 rounded-xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-900 pb-3 flex items-center gap-2">
            <span>📚</span> Core Chapters Overview
          </h2>
          <div className="space-y-4">
            {subjects.flatMap(s => s.chapters).map(chapter => {
              const record = progressList.find(p => p.lessonId === chapter.id);
              const percentage = record?.completionPercentage ?? 0;
              const isCompleted = record?.completed ?? false;

              return (
                <div key={chapter.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950 border border-slate-850 rounded-xl gap-4 hover:border-slate-800 transition">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-200">{chapter.title}</h4>
                    <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">{chapter.section}</span>
                  </div>
                  
                  {/* Progress status bar */}
                  <div className="flex items-center gap-6 w-full sm:w-64">
                    <div className="flex-1 bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isCompleted ? "bg-emerald-500" : percentage > 0 ? "bg-blue-500" : "bg-slate-800"}`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-16 text-right shrink-0">
                      {isCompleted ? (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          Done
                        </span>
                      ) : percentage > 0 ? (
                        <span className="text-xs text-blue-400 font-bold">{percentage}%</span>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">Unread</span>
                      )}
                    </div>
                  </div>

                  <Link href={`/lessons/${chapter.id}`} className="text-xs text-blue-400 font-semibold hover:underline shrink-0">
                    Study Chapter →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <PomodoroTimer />
    </div>
  );
}
