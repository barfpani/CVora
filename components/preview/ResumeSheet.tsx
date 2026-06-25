"use client";

import React from "react";
import { useResume, ResumeState } from "../../context/resume-state";
import { getFontClass, TemplateHeader } from "./Templates";
import {
  RenderSummary,
  RenderExperience,
  RenderEducation,
  RenderProjects,
  RenderSkills,
  RenderLanguages,
  RenderCertifications
} from "./Templates";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { GripVertical } from "lucide-react";

export default function ResumeSheet() {
  const { state, dispatch } = useResume();
  const { theme, sectionsOrder, visibleSections } = state;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4, // 4px drag threshold to avoid accidental click-drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // Filter sections that are toggled on
  const visibleSectionIds = sectionsOrder.filter(
    (id) => visibleSections[id] !== false
  );

  const fontClass = getFontClass(theme.font);

  return (
    <div
      id="resume-preview-sheet"
      className={`bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-xl border border-zinc-200 dark:border-zinc-800 rounded-sm relative selection:bg-blue-100 dark:selection:bg-blue-950/40 select-text ${fontClass} leading-normal overflow-hidden`}
      style={{
        /* A4 at 96dpi: 210mm = 794px, 297mm = 1123px */
        width: "794px",
        height: "1123px",
        padding: "48px 52px",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {/* Header (Not draggable, fixed at top) */}
      <TemplateHeader state={state} primaryColor={theme.primaryColor} />

      {/* Drag and Drop Sections */}
      <div className="mt-5 space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visibleSectionIds}
            strategy={verticalListSortingStrategy}
          >
            {visibleSectionIds.map((sectionId) => (
              <SortableSection
                key={sectionId}
                id={sectionId}
                state={state}
                primaryColor={theme.primaryColor}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

interface SortableSectionProps {
  id: string;
  state: ResumeState;
  primaryColor: string;
}

function SortableSection({ id, state, primaryColor }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  const renderSectionContent = () => {
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
  };

  const hasContent = () => {
    switch (id) {
      case "summary":
        return !!state.summary && state.summary.trim() !== "" && state.summary.trim() !== "<p></p>";
      case "workExperience":
        return state.workExperience.some(e => e.company || e.position);
      case "education":
        return state.education.some(e => e.school || e.degree);
      case "projects":
        return state.projects.some(p => p.name);
      case "skills":
        return state.skills.some(s => s.name && s.skills);
      case "languages":
        return state.languages.some(l => l.name);
      case "certifications":
        return state.certifications.some(c => c.name);
      default:
        return false;
    }
  };

  // If section has no user input, don't render it (or the drag handle wrapper)
  if (!hasContent()) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative p-2 -mx-2 rounded-lg border border-transparent hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/10 dark:hover:bg-blue-950/5 transition-all duration-150`}
    >
      {/* Reorder Grip Handle (appears on hover) */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-1.5 py-1 bg-white dark:bg-zinc-850 hover:bg-zinc-50 border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-blue-600 rounded-md shadow-sm cursor-grab active:cursor-grabbing transition-all duration-150 z-10"
        title="Drag to reorder section"
      >
        <GripVertical className="h-3.5 w-3.5" />
        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Reorder</span>
      </div>

      {renderSectionContent()}
    </div>
  );
}
