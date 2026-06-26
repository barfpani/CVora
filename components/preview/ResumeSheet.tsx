"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useResume, ResumeState } from "../../context/resume-state";
import { getFontClass, TemplateHeader } from "./Templates";
import {
  RenderSummary,
  RenderExperience,
  RenderEducation,
  RenderProjects,
  RenderSkills,
  RenderLanguages,
  RenderCertifications,
} from "./Templates";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { GripVertical } from "lucide-react";

export const RESUME_PAGE_WIDTH = 794;
export const RESUME_PAGE_HEIGHT = 1123;
export const RESUME_PAGE_GAP = 28;
const PAGE_PADDING_X = 52;
const PAGE_PADDING_Y = 48;
const HEADER_TO_SECTION_GAP = 20;

interface ResumeSheetProps {
  onPageCountChange?: (pageCount: number) => void;
}

export default function ResumeSheet({ onPageCountChange }: ResumeSheetProps) {
  const { state, dispatch } = useResume();
  const { theme, sectionsOrder, visibleSections } = state;
  const [pages, setPages] = useState<string[][]>([[]]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const measurementHeaderRef = useRef<HTMLDivElement | null>(null);
  const measurementSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      const nextHeaderHeight = measurementHeaderRef.current?.getBoundingClientRect().height ?? 0;
      const nextPages = buildPages(visibleSectionIds, measurementSectionRefs.current, nextHeaderHeight);
      setHeaderHeight(nextHeaderHeight);
      setPages(nextPages);
    });
    return () => cancelAnimationFrame(frame);
  }, [state, visibleSectionIds]);

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
  const headerSpacer = headerHeight > 0 ? headerHeight + HEADER_TO_SECTION_GAP : undefined;

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-[9999px] top-0 opacity-0"
      >
        <div
          className={`bg-white text-zinc-900 ${fontClass}`}
          style={{
            width: `${RESUME_PAGE_WIDTH}px`,
            padding: `${PAGE_PADDING_Y}px ${PAGE_PADDING_X}px`,
            boxSizing: "border-box",
          }}
        >
          <div ref={measurementHeaderRef}>
            <TemplateHeader state={state} primaryColor={theme.primaryColor} />
          </div>
          <div className="mt-5 space-y-4">
            {visibleSectionIds.map((sectionId) => (
              <div
                key={`measure-${sectionId}`}
                ref={(node) => {
                  measurementSectionRefs.current[sectionId] = node;
                }}
              >
                <SectionBody id={sectionId} state={state} primaryColor={theme.primaryColor} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="resume-preview-stack" className="flex flex-col gap-7">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={visibleSectionIds} strategy={verticalListSortingStrategy}>
            {pages.map((pageSectionIds, pageIndex) => (
              <div
                key={`page-${pageIndex}`}
                data-resume-page="true"
                className={`bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-xl border border-zinc-200 dark:border-zinc-800 rounded-sm relative selection:bg-blue-100 dark:selection:bg-blue-950/40 select-text ${fontClass} leading-normal overflow-hidden`}
                style={{
                  width: `${RESUME_PAGE_WIDTH}px`,
                  minHeight: `${RESUME_PAGE_HEIGHT}px`,
                  padding: `${PAGE_PADDING_Y}px ${PAGE_PADDING_X}px`,
                  boxSizing: "border-box",
                  flexShrink: 0,
                }}
              >
                {pageIndex === 0 ? (
                  <>
                    <TemplateHeader state={state} primaryColor={theme.primaryColor} />
                    <div className="mt-5 space-y-4">
                      {pageSectionIds.map((sectionId) => (
                        <SortableSection
                          key={sectionId}
                          id={sectionId}
                          state={state}
                          primaryColor={theme.primaryColor}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4" style={headerSpacer ? { paddingTop: `${headerSpacer}px` } : undefined}>
                    {pageSectionIds.map((sectionId) => (
                      <SortableSection
                        key={sectionId}
                        id={sectionId}
                        state={state}
                        primaryColor={theme.primaryColor}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

interface SortableSectionProps {
  id: string;
  state: ResumeState;
  primaryColor: string;
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
      className="group relative p-2 -mx-2 rounded-lg border border-transparent hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/10 dark:hover:bg-blue-950/5 transition-all duration-150"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-1.5 py-1 bg-white dark:bg-zinc-850 hover:bg-zinc-50 border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-blue-600 rounded-md shadow-sm cursor-grab active:cursor-grabbing transition-all duration-150 z-10"
        title="Drag to reorder section"
      >
        <GripVertical className="h-3.5 w-3.5" />
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

function buildPages(
  visibleSectionIds: string[],
  sectionRefs: Record<string, HTMLDivElement | null>,
  measuredHeaderHeight: number
) {
  if (visibleSectionIds.length === 0) {
    return [[]];
  }

  const firstPageLimit =
    RESUME_PAGE_HEIGHT - PAGE_PADDING_Y * 2 - measuredHeaderHeight - HEADER_TO_SECTION_GAP;
  const followingPageLimit = RESUME_PAGE_HEIGHT - PAGE_PADDING_Y * 2;

  const nextPages: string[][] = [[]];
  let currentPageIndex = 0;
  let usedHeight = 0;

  visibleSectionIds.forEach((sectionId) => {
    const sectionHeight = sectionRefs[sectionId]?.getBoundingClientRect().height ?? 0;
    const pageLimit = currentPageIndex === 0 ? firstPageLimit : followingPageLimit;
    const gap = nextPages[currentPageIndex].length > 0 ? 16 : 0;
    const nextHeight = usedHeight + gap + sectionHeight;

    if (nextPages[currentPageIndex].length > 0 && nextHeight > pageLimit) {
      nextPages.push([sectionId]);
      currentPageIndex += 1;
      usedHeight = sectionHeight;
      return;
    }

    nextPages[currentPageIndex].push(sectionId);
    usedHeight = nextHeight;
  });

  return nextPages;
}
