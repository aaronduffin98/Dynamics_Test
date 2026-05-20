import { Input as FluentInput } from "@fluentui/react-components";
import {
  AddRegular,
  ArrowClockwiseRegular,
  ArrowSortRegular,
  AttachRegular,
  BookmarkRegular,
  ChevronRightRegular,
  FilterRegular,
  MoreHorizontalRegular,
  PenRegular,
  SearchRegular,
} from "@fluentui/react-icons";

export default function RecordTimelineAside({
  createdShort,
  emptyMeta,
  emptyText = "Capture and manage all records in your timeline.",
  recordMetaLabel,
}) {
  const metaLine =
    recordMetaLabel ??
    (createdShort ? `Record created on ${createdShort}` : null);

  return (
    <aside className="mda-record-card mda-record-card--timeline" aria-label="Timeline">
      <div className="mda-timeline-aside__shell">
        <div className="mda-timeline-aside__main">
          <div className="mda-timeline-aside__bar">
            <span className="mda-timeline-aside__title">Timeline</span>
            <div className="mda-timeline-aside__actions">
              <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Add to timeline">
                <AddRegular />
              </button>
              <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Show followed records">
                <BookmarkRegular />
              </button>
              <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Filter timeline">
                <FilterRegular />
              </button>
              <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Sort timeline">
                <ArrowSortRegular />
              </button>
              <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Refresh timeline">
                <ArrowClockwiseRegular />
              </button>
              <button type="button" className="mda-timeline-aside__icon-btn" aria-label="More timeline options">
                <MoreHorizontalRegular />
              </button>
            </div>
          </div>
          <div className="mda-timeline-aside__body">
            <FluentInput
              placeholder="Search timeline"
              contentBefore={<SearchRegular className="mda-timeline-aside__field-icon" aria-hidden />}
              className="mda-timeline-aside__search"
              disabled
              appearance="outline"
              aria-label="Search timeline"
            />
            <FluentInput
              placeholder="Enter a note..."
              contentBefore={<PenRegular className="mda-timeline-aside__field-icon" aria-hidden />}
              contentAfter={<AttachRegular className="mda-timeline-aside__field-icon" aria-hidden />}
              className="mda-timeline-aside__note"
              disabled
              appearance="outline"
              aria-label="Enter a note"
            />
            <div className="mda-timeline-aside__empty">
              <h3 className="mda-timeline-aside__empty-title">Get started</h3>
              <p className="mda-timeline-aside__empty-text">{emptyText}</p>
              {emptyMeta ? <p className="mda-timeline-aside__empty-meta">{emptyMeta}</p> : null}
              {metaLine ? <p className="mda-timeline-aside__empty-meta">{metaLine}</p> : null}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="mda-timeline-aside__collapse"
          aria-label="Collapse timeline panel"
          title="Collapse timeline"
        >
          <ChevronRightRegular aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
