import {
  ArrowDown,
  Book1,
  Calendar2,
  CloseCircle,
  CloseSquare,
  Copy,
  Diamonds,
  Edit2,
  Eye,
  Filter,
  InfoCircle,
  More,
  SearchNormal,
  Sort,
  UserAdd,
  Wallet,
} from "iconsax-react";

const OVERVIEW = [
  { icon: Book1, label: "Total courses", value: "5" },
  { icon: Eye, label: "In Review", value: "12" },
  { icon: InfoCircle, label: "Needs Revision", value: "8" },
  { icon: CloseCircle, label: "Rejected", value: "12" },
  { icon: Edit2, label: "Draft/In Progress", value: "2" },
];

const COURSES = [
  {
    title: "Introduction to Software Development",
    category: "Information technology",
    id: "SLD-Rf...3d5",
    score: 0,
    status: "In review",
    chip: "bg-[#EAF3FF] text-[#0A60E1]",
  },
  {
    title: "Version Control and Collaboration",
    category: "Artificial intelligence",
    id: "SLD-Rf...3d5",
    score: 0,
    status: "In review",
    chip: "bg-[#EAF3FF] text-[#0A60E1]",
  },
  {
    title: "Fundamentals of Programming Languages",
    category: "Cloud computing",
    id: "SLD-Rf...3d5",
    score: 10,
    status: "Draft",
    chip: "bg-[#FFF3E0] text-[#D97706]",
  },
  {
    title: "Network Infrastructure Maintenance",
    category: "Information technology",
    id: "SLD-Rf...3d5",
    score: 0,
    status: "Needs revision",
    chip: "bg-[#FFF3E0] text-[#D97706]",
  },
  {
    title: "Debugging and Testing Techniques",
    category: "Information technology",
    id: "SLD-Rf...3d5",
    score: 0,
    status: "In review",
    chip: "bg-[#EAF3FF] text-[#0A60E1]",
  },
  {
    title: "Version Control and Collaboration",
    category: "Information technology",
    id: "SLD-Rf...3d5",
    score: 0,
    status: "In review",
    chip: "bg-[#EAF3FF] text-[#0A60E1]",
  },
  {
    title: "Deployment and Maintenance Strategies",
    category: "Cybersecurity",
    id: "SLD-Rf...3d5",
    score: 72,
    status: "Approved",
    chip: "bg-[#E8F7EE] text-[#16A34A]",
  },
];

const MODULES = [
  { name: "Module 1: The Origin and Advancement of Machines", lessons: 3 },
  { name: "Module 2: The Origin and Advancement of Machines", lessons: 3 },
  { name: "Module 3: The Introduction of Artificial intelligence", lessons: 2 },
];

const FILTERS = [
  { icon: <Filter variant="Linear" color="#606060" size={14} />, label: "Category", arrow: true },
  { icon: <Sort variant="Linear" color="#606060" size={14} />, label: "Status", arrow: true },
  { icon: <Sort variant="Linear" color="#606060" size={14} />, label: "Course type", arrow: true },
];

export function CtaAppMockup() {
  return (
    <div className="relative w-full overflow-visible rounded-bl-[16px] rounded-tl-[16px] rounded-tr-[16px] bg-[#F2F2F2] text-left shadow-[0_24px_60px_-20px_rgba(32,32,32,0.25)] ring-1 ring-sd-grey-3">
      <header className="flex h-[50px] items-center justify-between border-b border-[#F0F0F0] bg-[#FDFDFD] px-5 md:px-6">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/auth/logo.png"
            alt="SoluDesks"
            className="h-[26px] w-[96px] object-contain"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden h-9 w-[200px] items-center gap-2 rounded-[8px] border border-[#F0F0F0] bg-white px-3 sm:flex">
            <SearchNormal variant="Linear" color="#606060" size={16} />
            <span className="text-[13px] text-sd-grey-11">Search</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F9FF]">
            <Diamonds variant="Bold" color="#0A60E1" size={16} />
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF3FF]">
            <span className="text-[12px] font-semibold text-[#0A60E1]">D</span>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden w-[170px] shrink-0 border-r border-[#F0F0F0] bg-white px-3 py-4 md:block">
          {[
            { icon: <DashboardIcon />, label: "Dashboard", active: true },
            { icon: <Book1 variant="Linear" color="#606060" size={18} />, label: "My Courses" },
            { icon: <Edit2 variant="Linear" color="#606060" size={18} />, label: "Drafts" },
            { icon: <Wallet variant="Linear" color="#606060" size={18} />, label: "Wallet" },
            { icon: <UserAdd variant="Linear" color="#606060" size={18} />, label: "Collaborators" },
          ].map((item) => (
            <div
              key={item.label}
              className={`mb-1 flex h-10 items-center gap-2.5 rounded-[8px] px-3 text-[13px] ${
                item.active ? "bg-[#F5F9FF] text-sd-blue" : "text-sd-grey-11"
              }`}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </aside>

        <main className="min-w-0 flex-1 bg-[#FDFDFD] p-4 md:p-5">
          <div className="flex items-center justify-between">
            <p className="text-[17px] font-semibold leading-7 text-sd-black">My courses</p>
            <button
              type="button"
              className="flex h-[36px] items-center justify-center rounded-[8px] bg-sd-blue px-4 text-[13px] text-white"
            >
              New course
            </button>
          </div>

          <div className="mt-4">
            <p className="text-[15px] font-semibold leading-6 text-sd-black">Overview</p>
            <div className="mt-2.5 grid grid-cols-2 gap-3 lg:grid-cols-5">
              {OVERVIEW.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-[12px] bg-white p-3 ring-1 ring-[#F0F0F0]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#F5F9FF]">
                    <stat.icon variant="Bold" color="#0A60E1" size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] leading-4 text-sd-grey-11">{stat.label}</p>
                    <p className="text-[16px] font-bold leading-6 text-sd-black">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[16px] bg-white ring-1 ring-[#F0F0F0]">
            <div className="mt-3 flex flex-wrap items-center gap-2 px-4 pb-3">
              <div className="flex h-[38px] w-[220px] items-center gap-2 rounded-[8px] border border-[#F0F0F0] px-3">
                <SearchNormal variant="Linear" color="#606060" size={16} />
                <span className="text-[12px] text-sd-grey-11">Search course, ID</span>
              </div>
              {FILTERS.map((f) => (
                <div
                  key={f.label}
                  className="flex h-[38px] items-center gap-1.5 rounded-[8px] border border-[#F0F0F0] px-3 text-[12px] text-sd-grey-11"
                >
                  {f.icon}
                  {f.label}
                  {f.arrow && <ArrowDown variant="Linear" color="#606060" size={14} />}
                </div>
              ))}
              <div className="flex h-[38px] items-center gap-1.5 rounded-[8px] border border-[#F0F0F0] px-3 text-[12px] text-sd-grey-11">
                <Calendar2 variant="Linear" color="#606060" size={14} />
                Date
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-left">
                <thead>
                  <tr className="border-y border-[#F0F0F0] bg-[#FDFDFD]">
                    {["COURSE TITLE", "CATEGORY", "Course ID", "QUALITY SCORE", "STATUS", "LAST EDITED", ""].map(
                      (head) => (
                        <th
                          key={head}
                          className="px-4 py-2.5 text-[10px] font-medium tracking-wide text-sd-grey-11"
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {COURSES.map((course) => (
                    <tr key={`${course.title}-${course.category}`} className="border-b border-[#F0F0F0] last:border-0">
                      <td className="max-w-[230px] truncate px-4 py-3 text-[12px] text-sd-black">
                        {course.title}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-sd-grey-11">{course.category}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 whitespace-nowrap text-[12px] text-sd-black">
                          {course.id}
                          <Copy variant="Linear" color="#606060" size={13} />
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-[5px] w-[50px] overflow-hidden rounded-full bg-[#F0F0F0]">
                            <div
                              className="h-full rounded-full bg-sd-blue"
                              style={{ width: `${course.score}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-sd-grey-11">{course.score}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex h-[22px] items-center whitespace-nowrap rounded-full px-2 text-[10px] ${course.chip}`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[12px] text-sd-grey-11">
                        23 Mar 2026, 10:34 PM
                      </td>
                      <td className="px-4 py-3">
                        <More variant="Linear" color="#606060" size={18} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-[#F0F0F0] px-4 py-2.5">
              <span className="flex items-center gap-1 text-[11px] text-sd-grey-11">
                Show 10/page
                <ArrowDown variant="Linear" color="#606060" size={12} />
              </span>
              <div className="flex items-center gap-1.5">
                {["1", "2", "3", "...", "8"].map((page, index) => (
                  <span
                    key={`${page}-${index}`}
                    className={`flex h-[26px] w-[26px] items-center justify-center rounded-[6px] text-[11px] ${
                      page === "1"
                        ? "bg-sd-blue text-white"
                        : page === "..."
                          ? "text-sd-grey-11"
                          : "text-sd-grey-11 hover:bg-[#F5F9FF]"
                    }`}
                  >
                    {page}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <aside className="absolute right-0 top-[50px] hidden h-[calc(100%-50px)] w-[421px] flex-col rounded-l-[16px] bg-white shadow-[-12px_0_32px_-16px_rgba(32,32,32,0.18)] ring-1 ring-[#F0F0F0] lg:flex">
        <div className="flex h-[56px] items-center justify-between border-b border-[#F0F0F0] px-4">
          <p className="text-[16px] font-semibold text-sd-black">Course details</p>
          <CloseSquare variant="Linear" color="#606060" size={18} />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div>
            <p className="text-[12px] text-sd-grey-11">Status</p>
            <span className="mt-2 inline-flex h-[26px] items-center rounded-full bg-[#EAF3FF] px-3 text-[12px] text-[#0A60E1]">
              In review
            </span>
          </div>

          {[
            { label: "Topic", value: "Introduction to computer science" },
            { label: "Course category", value: "Information technology" },
            { label: "Difficulty level", value: "Intermediate" },
          ].map((field) => (
            <div key={field.label} className="mt-5">
              <p className="text-[12px] text-sd-grey-11">{field.label}</p>
              <p className="mt-1 text-[14px] font-medium text-sd-black">{field.value}</p>
            </div>
          ))}

          <div className="mt-5">
            <p className="text-[12px] text-sd-grey-11">Type</p>
            <span className="mt-2 inline-flex h-[26px] items-center rounded-full bg-[#F5F9FF] px-3 text-[12px] text-sd-blue">
              Digital course
            </span>
          </div>

          <div className="mt-6 h-px bg-[#F0F0F0]" />

          <div className="mt-6">
            <p className="text-[12px] text-sd-grey-11">Course Modules</p>
            <div className="mt-3 space-y-3">
              {MODULES.map((mod) => (
                <div
                  key={mod.name}
                  className="rounded-[10px] bg-[#FDFDFD] p-3 ring-1 ring-[#F0F0F0]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[13px] font-medium leading-5 text-sd-black">{mod.name}</p>
                    <ArrowDown variant="Linear" color="#606060" size={16} className="mt-1 shrink-0" />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-sd-grey-11">
                    Total lessons
                    <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#F5F9FF] text-[11px] font-medium text-sd-blue">
                      {mod.lessons}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[12px] text-sd-grey-11">Course category</p>
            <p className="mt-1 text-[14px] font-medium text-sd-black">Information technology</p>
          </div>

          <div className="mt-5">
            <p className="text-[12px] text-sd-grey-11">Date edited</p>
            <p className="mt-1 text-[14px] font-medium text-sd-black">23 Mar 2026, 10:23 AM</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.3 8.14 6.8 3.74a.5.5 0 0 0-.79 0l-3.5 4.4a.5.5 0 0 0 .4.81h6.6a.5.5 0 0 0 .39-.81ZM20.71 5.8l-1.3-2.1a.5.5 0 0 0-.42-.23h-3.98a.5.5 0 0 0-.42.23l-1.3 2.1a.5.5 0 0 0 .42.77h4.58a.5.5 0 0 0 .42-.77ZM15.03 12.38l-2.9-4.7a.5.5 0 0 0-.42-.23H6.5a.5.5 0 0 0-.42.23l-2.9 4.7a.5.5 0 0 0 .42.77h11a.5.5 0 0 0 .43-.77ZM16.4 13.15h-4.3a.5.5 0 0 0-.42.23l-2.2 3.57a.5.5 0 0 0 .42.77h8.6a.5.5 0 0 0 .42-.77l-2.2-3.57a.5.5 0 0 0-.42-.23ZM6.75 19.85h3.5c.33 0 .6-.27.6-.6v-1.5c0-.33-.27-.6-.6-.6h-3.5c-.33 0-.6.27-.6.6v1.5c0 .33.27.6.6.6Z"
        fill="#0A60E1"
      />
    </svg>
  );
}
