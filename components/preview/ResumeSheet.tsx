"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useResume, ResumeState } from "../../context/resume-state";
import {
  getFontClass,
  RenderCertifications,
  RenderEducation,
  RenderExperience,
  RenderLanguages,
  RenderProjects,
  RenderSkills,
  RenderSummary,
  TemplateHeader,
} from "./Templates";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export const RESUME_PAGE_WIDTH = 794;
export const RESUME_PAGE_HEIGHT = 1123;
export const RESUME_PAGE_GAP = 28;
const PAGE_PADDING_X = 52;
const PAGE_PADDING_Y = 48;

interface ResumeSheetProps {
  onPageCountChange?: (pageCount: number) => void;
}

interface SortableSectionProps {
  id: string;
  state: ResumeState;
  primaryColor: string;
}

interface PageFrameProps {
  children: React.ReactNode;
  className: string;
  contentRef?: (node: HTMLDivElement | null) => void;
  primaryColor: string;
  showHeader: boolean;
  state: ResumeState;
}

export default function ResumeSheet({ onPageCountChange }: ResumeSheetProps) {
  const { state, dispatch } = useResume();
  const { theme, sectionsOrder, visibleSections } = state;
  const [pages, setPages] = useState<string[][]>([[]]);
  const pageContentRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const visibleSectionIds = useMemo(
    () =>
      sectionsOrder.filter(
        (id) => visibleSections[id] !== false && hasSectionContent(id, state)
      ),
    [sectionsOrder, state, visibleSections]
  );

  const paginationKey = useMemo(
    () =>
      JSON.stringify({
        visibleSectionIds,
        personalInfo: state.personalInfo,
        summary: state.summary,
        workExperience: state.workExperience,
        education: state.education,
        projects: state.projects,
        skills: state.skills,
        languages: state.languages,
        certifications: state.certifications,
        theme: {
          template: state.theme.template,
          primaryColor: state.theme.primaryColor,
          font: state.theme.font,
          contentFontSize: state.theme.contentFontSize,
          sectionFonts: state.theme.sectionFonts,
        },
      }),
    [
      state.certifications,
      state.education,
      state.languages,
      state.personalInfo,
      state.projects,
      state.skills,
      state.summary,
      state.theme.contentFontSize,
      state.theme.font,
      state.theme.primaryColor,
      state.theme.sectionFonts,
      state.theme.template,
      state.workExperience,
      visibleSectionIds,
    ]
  );

  useLayoutEffect(() => {
    setPages(visibleSectionIds.length > 0 ? [visibleSectionIds] : [[]]);
  }, [paginationKey, visibleSectionIds]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPages((currentPages) => {
        const nextPages = rebalancePages(currentPages, pageContentRefs.current);
        return pagesEqual(currentPages, nextPages) ? currentPages : nextPages;
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [pages, paginationKey]);

  useEffect(() => {
    onPageCountChange?.(pages.length || 1);
  }, [onPageCountChange, pages.length]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sectionsOrder.indexOf(active.id as string);
    const newIndex = sectionsOrder.indexOf(over.id as string);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(sectionsOrder, oldIndex, newIndex);
      dispatch({ type: "REORDER_SECTIONS", payload: newOrder });
    }
  };

  const fontClass = getFontClass(theme.sectionFonts.personalDetails ?? theme.font);

  return (
    <div id="resume-preview-stack" className="flex flex-col gap-7">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={visibleSectionIds} strategy={verticalListSortingStrategy}>
          {pages.map((pageSectionIds, pageIndex) => (
            <PageFrame
              key={`page-${pageIndex}`}
              className={fontClass}
              contentRef={(node) => {
                pageContentRefs.current[pageIndex] = node;
              }}
              showHeader={pageIndex === 0}
              state={state}
              primaryColor={theme.primaryColor}
            >
              {pageSectionIds.map((sectionId) => (
                <SortableSection
                  key={sectionId}
                  id={sectionId}
                  state={state}
                  primaryColor={theme.primaryColor}
                />
              ))}
            </PageFrame>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

function PageFrame({ children, className, contentRef, primaryColor, showHeader, state }: PageFrameProps) {
  return (
    <div
      data-resume-page="true"
      className={`relative flex shrink-0 flex-col overflow-hidden rounded-sm border border-zinc-200 bg-white text-zinc-900 shadow-xl selection:bg-blue-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:selection:bg-blue-950/40 ${className}`}
      style={{
        width: `${RESUME_PAGE_WIDTH}px`,
        height: `${RESUME_PAGE_HEIGHT}px`,
        padding: `${PAGE_PADDING_Y}px ${PAGE_PADDING_X}px`,
        boxSizing: "border-box",
      }}
    >
      {showHeader ? (
        <>
          <TemplateHeader state={state} primaryColor={primaryColor} />
          <div ref={contentRef} className="mt-5 min-h-0 flex-1 overflow-hidden">
            <div className="space-y-4">{children}</div>
          </div>
        </>
      ) : (
        <div ref={contentRef} className="min-h-0 flex-1 overflow-hidden">
          <div className="space-y-4">{children}</div>
        </div>
      )}
    </div>
  );
}

function SortableSection({ id, state, primaryColor }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative -mx-2 rounded-lg border border-transparent p-2 transition-all duration-150 hover:border-blue-200 hover:bg-blue-50/10 dark:hover:border-blue-900/50 dark:hover:bg-blue-950/5"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 right-1 z-10 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-1.5 py-1 text-zinc-400 opacity-0 shadow-sm transition-all duration-150 hover:bg-zinc-50 hover:text-blue-600 group-hover:opacity-100 active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-850"
        title="Drag to reorder section"
      >
        <GripVertical className="h-3.5 w-3.5 cursor-grab" />
        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Reorder</span>
      </div>

      <SectionBody id={id} state={state} primaryColor={primaryColor} />
    </div>
  );
}

function SectionBody({ id, state, primaryColor }: SortableSectionProps) {
  switch (id) {
    case "summary":
      return <RenderSummary state={state} primaryColor={primaryColor} />;
    case "workExperience":
      return <RenderExperience state={state} primaryColor={primaryColor} />;
    case "education":
      return <RenderEducation state={state} primaryColor={primaryColor} />;
    case "projects":
      return <RenderProjects state={state} primaryColor={primaryColor} />;
    case "skills":
      return <RenderSkills state={state} primaryColor={primaryColor} />;
    case "languages":
      return <RenderLanguages state={state} primaryColor={primaryColor} />;
    case "certifications":
      return <RenderCertifications state={state} primaryColor={primaryColor} />;
    default:
      return null;
  }
}

function hasSectionContent(id: string, state: ResumeState) {
  switch (id) {
    case "summary":
      return !!state.summary && state.summary.trim() !== "" && state.summary.trim() !== "<p></p>";
    case "workExperience":
      return state.workExperience.some((experience) => experience.company || experience.position);
    case "education":
      return state.education.some((education) => education.school || education.degree);
    case "projects":
      return state.projects.some((project) => project.name);
    case "skills":
      return state.skills.some((skill) => skill.name && skill.skills);
    case "languages":
      return state.languages.some((language) => language.name);
    case "certifications":
      return state.certifications.some((certification) => certification.name);
    default:
      return false;
  }
}

function rebalancePages(
  currentPages: string[][],
  pageContentRefs: Record<number, HTMLDivElement | null>
) {
  const nextPages = normalizePages(currentPages.map((page) => [...page]));

  for (let pageIndex = 0; pageIndex < nextPages.length; pageIndex += 1) {
    const pageContent = pageContentRefs[pageIndex];
    if (!pageContent) continue;

    const isOverflowing = pageContent.scrollHeight > pageContent.clientHeight + 1;
    if (!isOverflowing) continue;

    if (nextPages[pageIndex].length <= 1) {
      continue;
    }

    const movedSectionId = nextPages[pageIndex].pop();
    if (!movedSectionId) continue;

    if (!nextPages[pageIndex + 1]) {
      nextPages[pageIndex + 1] = [];
    }

    nextPages[pageIndex + 1].unshift(movedSectionId);
    return normalizePages(nextPages);
  }

  return normalizePages(nextPages);
}

function normalizePages(pages: string[][]) {
  const normalized = pages.filter((page, index) => page.length > 0 || index === 0);
  while (normalized.length > 1 && normalized[normalized.length - 1].length === 0) {
    normalized.pop();
  }
  return normalized.length > 0 ? normalized : [[]];
}

function pagesEqual(left: string[][], right: string[][]) {
  if (left.length !== right.length) return false;

  for (let pageIndex = 0; pageIndex < left.length; pageIndex += 1) {
    if (left[pageIndex].length !== right[pageIndex].length) return false;

    for (let sectionIndex = 0; sectionIndex < left[pageIndex].length; sectionIndex += 1) {
      if (left[pageIndex][sectionIndex] !== right[pageIndex][sectionIndex]) {
        return false;
      }
    }
  }

  return true;
}
