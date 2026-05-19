import { Input as FluentInput } from "@fluentui/react-components";
import {
  AddRegular,
  ArrowSortRegular,
  AttachRegular,
  DocumentRegular,
  FilterRegular,
  MoreHorizontalRegular,
  PenRegular,
  SearchRegular,
} from "@fluentui/react-icons";

export default function RecordTimelineAside({ createdShort, emptyMeta }) {
  return (
    <aside className="mda-record-card mda-record-card--timeline" aria-label="Timeline">
      <div className="mda-timeline-aside__bar">
        <span className="mda-timeline-aside__title">Timeline</span>
        <div className="mda-timeline-aside__actions">
          <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Add to timeline">
            <AddRegular />
          </button>
          <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Filter timeline">
            <FilterRegular />
          </button>
          <button type="button" className="mda-timeline-aside__icon-btn" aria-label="Sort">
            <ArrowSortRegular />
          </button>
          <button type="button" className="mda-timeline-aside__icon-btn" aria-label="More">
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
          placeholder="Enter a note…"
          contentAfter={
            <span className="mda-timeline-aside__note-icons" aria-hidden="true">
              <PenRegular className="mda-timeline-aside__field-icon" />
              <AttachRegular className="mda-timeline-aside__field-icon" />
            </span>
          }
          className="mda-timeline-aside__note"
          disabled
          appearance="outline"
          aria-label="Note"
        />
        <div className="mda-timeline-aside__empty">
          <span className="mda-timeline-aside__empty-icon" aria-hidden="true">
            <DocumentRegular fontSize={32} />
          </span>
          <h3 className="mda-timeline-aside__empty-title">Get started</h3>
          <p className="mda-timeline-aside__empty-text">
            Capture and manage all records in your timeline.
          </p>
          {emptyMeta ? <p className="mda-timeline-aside__empty-meta">{emptyMeta}</p> : null}
          {createdShort ? (
            <p className="mda-timeline-aside__empty-meta">Record created on {createdShort}</p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
