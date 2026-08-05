import Image from "next/image";

const COURSES = [
  {
    title: "Introduction to Software Development",
    category: "Information technology",
    score: 0,
    status: "Approved",
    chip: "bg-[#E8F7EE] text-[#16A34A]",
  },
  {
    title: "Version Control and Collaboration",
    category: "Artificial intelligence",
    score: 0,
    status: "In review",
    chip: "bg-[#EAF3FF] text-[#0A60E1]",
  },
  {
    title: "Fundamentals of Programming Languages",
    category: "Cloud computing",
    score: 10,
    status: "Draft",
    chip: "bg-[#FFF3E0] text-[#D97706]",
  },
  {
    title: "Network Infrastructure Maintenance",
    category: "Information technology",
    score: 0,
    status: "Needs revision",
    chip: "bg-[#FFF3E0] text-[#D97706]",
  },
  {
    title: "Debugging and Testing Techniques",
    category: "Information technology",
    score: 0,
    status: "Rejected",
    chip: "bg-[#FFEBE8] text-[#DC2626]",
  },
  {
    title: "Deployment and Maintenance Strategies",
    category: "Cybersecurity",
    score: 72,
    status: "Approved",
    chip: "bg-[#E8F7EE] text-[#16A34A]",
  },
];

const TRANSACTIONS = [
  "Fundamentals of programming",
  "Version Control and Collaboration",
  "Deployment and Maintenance Strategies",
  "Deployment and Maintenance Strategies",
  "Deployment and Maintenance Strategies",
];

const STATUS_CHIP: Record<string, string> = {
  Pending: "bg-[#EAF3FF] text-[#0A60E1]",
  Completed: "bg-[#E8F7EE] text-[#16A34A]",
  Failed: "bg-[#FFEBE8] text-[#DC2626]",
};

const ICON = "/assets/dashboard";

export function HeroDashboardMockup() {
  return (
    <div className="w-full overflow-hidden rounded-bl-[16px] rounded-tl-[16px] rounded-tr-[16px] bg-[#F2F2F2] text-left shadow-[0_24px_60px_-20px_rgba(32,32,32,0.25)] ring-1 ring-sd-grey-3">
      <header className="flex h-[64px] items-center justify-between border-b border-[#F0F0F0] bg-[#FDFDFD] px-5 md:px-6">
        <div className="flex items-center gap-2.5">
          <img src="/assets/auth/logo.png" alt="SoluDesk" className="h-[28px] w-[104px] object-contain" />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden h-10 w-[220px] items-center gap-2 rounded-[8px] border border-[#F0F0F0] bg-white px-3 sm:flex">
            <Image src={`${ICON}/search-normal-linear.svg`} alt="" width={16} height={16} className="size-4" />
            <span className="text-[13px] text-sd-grey-11">Search</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F9FF]">
            <Image src={`${ICON}/diamonds-bold.svg`} alt="" width={18} height={18} className="size-[18px]" />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF3FF]">
            <span className="text-[13px] font-semibold text-[#0A60E1]">D</span>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden w-[200px] shrink-0 border-r border-[#F0F0F0] bg-white px-3 py-4 md:block">
          {[
            { icon: `${ICON}/element-4-bold.svg`, label: "Dashboard", active: true },
            { icon: `${ICON}/book-linear.svg`, label: "My Courses" },
            { icon: `${ICON}/diamonds-linear.svg`, label: "Drafts" },
            { icon: `${ICON}/wallet-linear.svg`, label: "Wallet" },
            { icon: `${ICON}/money-linear.svg`, label: "Reservation" },
            { icon: `${ICON}/user-add-linear.svg`, label: "Collaborators" },
            { icon: `${ICON}/filter-linear.svg`, label: "Settings" },
          ].map((item) => (
            <div
              key={item.label}
              className={`mb-1 flex h-10 items-center gap-2.5 rounded-[8px] px-3 text-[13px] ${
                item.active ? "bg-[#F5F9FF] text-sd-blue" : "text-sd-grey-11"
              }`}
            >
              <Image src={item.icon} alt="" width={18} height={18} className="size-[18px]" />
              {item.label}
            </div>
          ))}
        </aside>

        <main className="min-w-0 flex-1 bg-[#FDFDFD] p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-[22px] font-semibold leading-8 text-sd-black md:text-[26px]">
                Welcome, Dogs!
              </h3>
              <p className="text-[14px] leading-5 text-sd-grey-11">
                Lets help you create something good today
              </p>
              <div className="mt-2 inline-flex h-[26px] items-center gap-1.5 rounded-full bg-[#F5F9FF] px-3">
                <Image src={`${ICON}/diamonds-bold.svg`} alt="" width={14} height={14} className="size-3.5" />
                <span className="text-[12px] text-[#0A60E1]">Top creator</span>
              </div>
            </div>
            <button
              type="button"
              className="flex h-[38px] items-center gap-2 rounded-[8px] border border-sd-blue bg-white px-4 text-[13px] text-sd-blue transition-colors hover:bg-sd-blue/5"
            >
              <Image src={`${ICON}/user-add-bold.svg`} alt="" width={16} height={16} className="size-4" />
              Invite
            </button>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-4 rounded-[16px] bg-white p-4 ring-1 ring-[#F0F0F0] md:flex-row md:items-center">
            <div>
              <p className="text-[16px] font-semibold leading-6 text-sd-black">
                Start your journey to building digital courses
              </p>
              <p className="mt-0.5 text-[13px] leading-5 text-sd-grey-11">
                Join thousands of competitors and start creating courses while your earn from it
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                className="flex h-[40px] items-center justify-center rounded-[8px] bg-sd-blue px-5 text-[13px] text-white"
              >
                Create course
              </button>
              <button
                type="button"
                className="flex h-[40px] items-center justify-center rounded-[8px] border border-sd-blue bg-white px-5 text-[13px] text-sd-blue"
              >
                Explore
              </button>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[15px] font-semibold leading-6 text-sd-black">Creator&apos;s overview</p>
            <div className="mt-2.5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { icon: `${ICON}/money-bold.svg`, label: "Total amount earned", value: "$456,000.03" },
                { icon: `${ICON}/wallet-bold.svg`, label: "Wallet Balance", value: "$456,000" },
                { icon: `${ICON}/book-bold.svg`, label: "Total courses", value: "32" },
                { icon: `${ICON}/eye-bold.svg`, label: "In review", value: "12" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-[12px] bg-white p-3 ring-1 ring-[#F0F0F0]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#F5F9FF]">
                    <Image src={stat.icon} alt="" width={20} height={20} className="size-5" />
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
            <div className="flex items-center justify-between px-4 pt-4">
              <p className="text-[15px] font-semibold leading-6 text-sd-black">My courses</p>
              <button
                type="button"
                className="flex items-center gap-1 text-[12px] text-sd-blue"
              >
                See all
                <Image src={`${ICON}/arrow-left-linear.svg`} alt="" width={16} height={16} className="size-4 rotate-180" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 px-4 pb-3">
              <div className="flex h-[38px] w-[220px] items-center gap-2 rounded-[8px] border border-[#F0F0F0] px-3">
                <Image src={`${ICON}/search-normal-linear.svg`} alt="" width={16} height={16} className="size-4" />
                <span className="text-[12px] text-sd-grey-11">Search course</span>
              </div>
              {[
                { icon: `${ICON}/filter-linear.svg`, label: "Category", arrow: true },
                { icon: `${ICON}/sort-linear.svg`, label: "Status", arrow: true },
                { icon: `${ICON}/calendar-2-linear.svg`, label: "Date" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex h-[38px] items-center gap-1.5 rounded-[8px] border border-[#F0F0F0] px-3 text-[12px] text-sd-grey-11"
                >
                  <Image src={f.icon} alt="" width={14} height={14} className="size-3.5" />
                  {f.label}
                  {f.arrow && (
                    <Image src={`${ICON}/arrow-down-linear.svg`} alt="" width={14} height={14} className="size-3.5" />
                  )}
                </div>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-y border-[#F0F0F0] bg-[#FDFDFD]">
                    {["COURSE TITLE", "CATEGORY", "QUALITY SCORE", "STATUS", "LAST EDITED", ""].map(
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
                    <tr key={course.title} className="border-b border-[#F0F0F0] last:border-0">
                      <td className="max-w-[240px] truncate px-4 py-3 text-[12px] text-sd-black">
                        {course.title}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-sd-grey-11">{course.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-[5px] w-[60px] overflow-hidden rounded-full bg-[#F0F0F0]">
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
                          className={`inline-flex h-[22px] items-center rounded-full px-2 text-[10px] ${course.chip}`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[12px] text-sd-grey-11">
                        23 Mar 2026, 10:34 PM
                      </td>
                      <td className="px-4 py-3">
                        <Image src={`${ICON}/more-linear.svg`} alt="" width={18} height={18} className="size-[18px]" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-[#F0F0F0] px-4 py-2.5">
              <span className="text-[11px] text-sd-grey-11">Show 10/page</span>
              <span className="text-[11px] text-sd-grey-11">1 2 3 ... 8</span>
            </div>
          </div>

          <div className="mt-5 rounded-[16px] bg-white ring-1 ring-[#F0F0F0]">
            <div className="flex items-center justify-between px-4 pt-4">
              <p className="text-[15px] font-semibold leading-6 text-sd-black">Transaction activity</p>
              <button
                type="button"
                className="flex items-center gap-1 text-[12px] text-sd-blue"
              >
                See all
                <Image src={`${ICON}/arrow-left-linear.svg`} alt="" width={16} height={16} className="size-4 rotate-180" />
              </button>
            </div>
            <div className="mt-3 overflow-x-auto pb-2">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-y border-[#F0F0F0] bg-[#FDFDFD]">
                    {["REFERENCE", "DESCRIPTION", "DATE", "AMOUNT", "STATUS"].map((head) => (
                      <th
                        key={head}
                        className="px-4 py-2.5 text-[10px] font-medium tracking-wide text-sd-grey-11"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map((description, index) => (
                    <tr key={`${description}-${index}`} className="border-b border-[#F0F0F0] last:border-0">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-[11px] text-sd-grey-11">
                            EARSF4FCkeeEqgB5nnLjt32wqMgaFJrNsnT
                          </span>
                          <Image src={`${ICON}/copy-linear.svg`} alt="" width={13} height={13} className="size-[13px]" />
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-sd-black">{description}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-[12px] text-sd-grey-11">
                        23 Mar 2026, 10:34 PM
                      </td>
                      <td className="px-4 py-3 text-[12px] text-sd-black">$5</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex h-[22px] items-center rounded-full px-2 text-[10px] ${
                            STATUS_CHIP[index % 2 === 0 ? "Completed" : "Pending"]
                          }`}
                        >
                          {index % 2 === 0 ? "Completed" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
