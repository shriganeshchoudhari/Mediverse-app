package com.curiolearn;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

@AnalyzeClasses(packages = "com.curiolearn", importOptions = ImportOption.DoNotIncludeTests.class)
public class ArchitectureTest {

    @ArchTest
    public static final ArchRule services_should_not_depend_on_controllers =
            noClasses().that().haveSimpleNameEndingWith("Service")
                    .should().dependOnClassesThat().haveSimpleNameEndingWith("Controller");

    @ArchTest
    public static final ArchRule repositories_should_not_depend_on_services_or_controllers =
            noClasses().that().haveSimpleNameEndingWith("Repository")
                    .should().dependOnClassesThat().haveSimpleNameEndingWith("Service")
                    .orShould().dependOnClassesThat().haveSimpleNameEndingWith("Controller");

    @ArchTest
    public static final ArchRule common_should_not_depend_on_feature_packages =
            noClasses().that().resideInAPackage("..com.curiolearn.common..")
                    .should().dependOnClassesThat().resideInAnyPackage(
                            "..com.curiolearn.auth..",
                            "..com.curiolearn.curriculum..",
                            "..com.curiolearn.flashcard..",
                            "..com.curiolearn.progress..",
                            "..com.curiolearn.quiz..",
                            "..com.curiolearn.simulation..",
                            "..com.curiolearn.social..",
                            "..com.curiolearn.ai..",
                            "..com.curiolearn.aitutor.."
                    );
}
