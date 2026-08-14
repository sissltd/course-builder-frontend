import re

file_path = "/Users/user/projects/course-builder-frontend/src/modules/reviewer/course-overview/ReviewerCourseOverviewView.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Update the sidebar
sidebar_old = """        <aside className="border-b border-sd-grey-3 bg-sd-grey-1 px-[18px] py-[16px] md:border-b-0 md:border-r">
          {["script", "quizzes", "media"].includes(activeTab) ? (
            <ScriptModuleRail />
          ) : ("""

sidebar_new = """        <aside className="border-b border-sd-grey-3 bg-sd-grey-1 px-[18px] py-[16px] md:border-b-0 md:border-r">
          {activeTab === 'script' ? (
            <ScriptModuleRail />
          ) : activeTab === 'quizzes' ? (
            <QuizModuleRail />
          ) : activeTab === 'media' ? (
            <MediaModuleRail />
          ) : ("""

if sidebar_old in content:
    content = content.replace(sidebar_old, sidebar_new)
    print("Patched sidebar")
else:
    print("Sidebar old not found")

# 2. Extract renderQuizzes completely
quizzes_start = content.find("  const renderQuizzes = () => (")
quizzes_end = content.find("  const renderMedia = () => (")
if quizzes_start != -1 and quizzes_end != -1:
    quizzes_content = content[quizzes_start:quizzes_end]
    
    new_render_quizzes = """  const renderQuizzes = () => (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[12px] border-b border-sd-grey-3 pb-[24px]">
        <div className="flex items-center gap-[12px]">
          <PlayCircle size={24} variant="Linear" color="var(--sd-grey-12)" />
          <h2 className="text-[22px] font-semibold leading-[28px] text-sd-grey-12">
            Lesson 1 Quiz
          </h2>
        </div>
        <div className="ml-[36px] flex items-center gap-[24px] text-[12px] leading-[16px] text-sd-reviewer-muted">
          <span className="flex items-center gap-[8px]">
            <TaskSquare size={16} variant="Linear" color="currentColor" />
            <span>4 questions</span>
          </span>
          <span className="flex items-center gap-[8px]">
            <TickCircle size={16} variant="Linear" color="currentColor" />
            <span>Pass mark 70%</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[12px]">
        {quizQuestions.map((quiz, index) => (
          <div
            key={quiz.prompt}
            className="rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 p-[16px]"
          >
            <div className="flex items-start justify-between gap-[16px]">
              <div className="flex min-w-0 gap-[8px]">
                <span className="shrink-0 text-[14px] font-semibold leading-[20px] text-sd-grey-12">
                  {index + 1}.
                </span>
                <p className="text-[14px] font-semibold leading-[20px] text-sd-grey-12">
                  {quiz.prompt}
                </p>
              </div>
            </div>

            <div className="mt-[16px] grid gap-[10px] md:grid-cols-2">
              {quiz.options.map((option) => {
                const correct = option === quiz.answer;
                return (
                  <div
                    key={option}
                    className={cn(
                      "flex min-h-[44px] items-center gap-[10px] rounded-[8px] border px-[12px] py-[10px] text-[14px] font-normal leading-[20px]",
                      correct
                        ? "border-sd-blue bg-sd-blue-light text-sd-grey-12"
                        : "border-sd-grey-3 bg-sd-grey-1 text-sd-reviewer-muted",
                    )}
                  >
                    <div className={cn(
                      "flex size-[16px] items-center justify-center rounded-full border shrink-0",
                      correct ? "border-[5px] border-sd-blue bg-white" : "border-sd-grey-4 bg-transparent"
                    )} />
                    <span>{option}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-[12px] flex items-center gap-[8px] text-[12px] font-normal leading-[16px] text-sd-reviewer-muted">
              <TickCircle size={16} variant="Bold" color="var(--sd-blue)" />
              <span>Correct answer: {quiz.answer}</span>
            </div>
            
            <div className="mt-[12px] flex items-start gap-[8px] rounded-[6px] bg-[#FCF5E8] p-[8px] text-[12px] leading-[16px] text-[#B77815]">
              <InfoCircle size={14} variant="Bulk" className="mt-[1px] shrink-0" color="#B77815" />
              <span>{quiz.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

"""
    content = content.replace(quizzes_content, new_render_quizzes)
    print("Patched renderQuizzes")
else:
    print("quizzes bounds not found")

# 3. Extract renderMedia completely
media_start = content.find("  const renderMedia = () => (")
media_end = content.find("  const renderTabContent = () => {")
if media_start != -1 and media_end != -1:
    media_content = content[media_start:media_end]
    
    new_render_media = """  const renderMedia = () => (
    <div className="flex flex-col gap-[20px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
        {[
          { label: "Total Video", value: "2", icon: VideoPlay },
          { label: "Total Duration", value: "3h 45m", icon: LibraryBig },
          { label: "Total File Size", value: "2.4 GB", icon: PlayCircle }
        ].map((stat) => (
          <div key={stat.label} className="flex min-h-[58px] items-center gap-[12px] rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 px-[14px] py-[12px] shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            <div className="flex size-[36px] items-center justify-center rounded-[8px] border border-sd-blue-light bg-sd-blue-light">
              <stat.icon size={20} color="var(--sd-blue)" variant="Linear" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-[18px] font-semibold leading-[24px] text-sd-grey-12">
                {stat.value}
              </span>
              <span className="text-[12px] leading-[16px] text-sd-reviewer-muted">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[16px]">
        <div className="mb-[12px] text-[14px] font-semibold leading-[20px] text-sd-grey-12">
          Preview Video
        </div>
        <div className="relative overflow-hidden rounded-[10px] border border-sd-grey-3 bg-sd-grey-2">
          <Image
            src="/assets/creators/creators-hero.png"
            alt="Media preview"
            width={1200}
            height={680}
            className="h-[290px] w-full object-cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <button
              type="button"
              className="flex size-[58px] items-center justify-center rounded-full border border-white/25 bg-white/25 text-white backdrop-blur-[8px]"
              aria-label="Play media"
            >
              <Play size={24} variant="Bold" color="currentColor" />
            </button>
          </div>
          <div className="absolute bottom-[16px] left-[16px] right-[16px] flex items-center gap-[12px]">
            <span className="text-[12px] font-medium text-white shadow-sm">03:24</span>
            <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-white/30 backdrop-blur-sm">
              <div className="h-full w-1/2 bg-sd-blue rounded-full" />
            </div>
            <span className="text-[12px] font-medium text-white shadow-sm">03:24</span>
          </div>
        </div>
        <div className="mt-[16px] flex flex-wrap items-center gap-[16px] text-[12px] leading-[16px] text-sd-reviewer-muted">
          <span className="flex items-center gap-[6px]">
            <Timer1 size={16} variant="Linear" color="currentColor" />
            <span>Duration 3:24mins</span>
          </span>
          <span className="flex items-center gap-[6px]">
            <Monitor size={16} variant="Linear" color="currentColor" />
            <span>Resolution 1080p</span>
          </span>
          <span className="flex items-center gap-[6px]">
            <VolumeHigh size={16} variant="Linear" color="currentColor" />
            <span>Audio Quality -16 LUFS</span>
          </span>
        </div>
      </div>

      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[18px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Media properties
        </h2>
        <div className="mt-[16px] grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          {[
            { label: "Resolution", value: "1080p", status: "Pass" },
            { label: "Audio quality", value: "-16 LUFS", status: "Pass" },
            { label: "Format", value: "Mp4", status: "Pass" },
            { label: "Duration", value: "10mins", status: "Pass" },
            { label: "File Size", value: "30mb", status: "Pass" },
            { label: "SRT", value: "English_1.srt", status: "Pass" }
          ].map((prop) => (
            <div key={prop.label} className="rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 p-[12px]">
              <span className="text-[12px] text-sd-reviewer-muted">{prop.label}</span>
              <div className="mt-[4px] flex items-center justify-between">
                <span className="text-[14px] font-medium text-sd-grey-12">{prop.value}</span>
                <span className="rounded-[4px] bg-[#EAFBF3] px-[8px] py-[2px] text-[10px] font-semibold text-[#16A34A] uppercase">
                  {prop.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

"""
    content = content.replace(media_content, new_render_media)
    print("Patched renderMedia")
else:
    print("media bounds not found")

# 4. Insert Rail components at the end
rails = """
const QuizModuleRail = () => {
  const lessonItems = [
    { label: 'Lesson 1 Quiz', icon: TaskSquare, active: true },
    { label: 'Lesson 2 Quiz', icon: TaskSquare, active: false },
    { label: 'Lesson 3 Quiz', icon: TaskSquare, active: false },
    { label: 'Lesson 4 Quiz', icon: TaskSquare, active: false },
  ]

  return (
    <div className="flex flex-col gap-[16px]">
      <section className="rounded-[8px] border border-sd-blue bg-sd-grey-1 p-[12px]">
        <button
          type="button"
          className="flex h-[20px] w-full items-center justify-between gap-[12px] text-left"
        >
          <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12">
            Module 1
          </span>
          <ArrowDown2 size={20} variant="Linear" color="var(--sd-grey-12)" />
        </button>

        <div className="mt-[8px] flex flex-col">
          {lessonItems.map((lesson) => {
            const Icon = lesson.icon

            return (
              <button
                key={lesson.label}
                type="button"
                className={cn(
                  'flex h-[32px] items-center rounded-[6px] px-[12px] text-left',
                  lesson.active && 'bg-sd-grey-3',
                )}
              >
                <span className="flex w-full items-center gap-[8px]">
                  <Icon size={16} variant="Linear" color="var(--sd-grey-11)" />
                  <span className="min-w-0 flex-1 truncate text-[14px] font-normal leading-[20px] text-sd-grey-11">
                    {lesson.label}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {['Module 2', 'Module 3', 'Module 4'].map((module) => (
        <button
          key={module}
          type="button"
          className="flex h-[36px] items-center justify-between rounded-[8px] border border-sd-grey-4 bg-sd-grey-1 px-[12px] text-left"
        >
          <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12">
            {module}
          </span>
          <ArrowRight2 size={20} variant="Linear" color="var(--sd-grey-11)" />
        </button>
      ))}
    </div>
  )
}

const MediaModuleRail = () => {
  const lessonItems = [
    { label: 'Lesson 1', icon: PlayCircle, active: true },
    { label: 'Lesson 2', icon: Book, active: false },
    { label: 'Lesson 3', icon: Book, active: false },
  ]

  return (
    <div className="flex flex-col gap-[16px]">
      <section className="rounded-[8px] border border-sd-blue bg-sd-grey-1 p-[12px]">
        <button
          type="button"
          className="flex h-[20px] w-full items-center justify-between gap-[12px] text-left"
        >
          <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12">
            Module 1
          </span>
          <ArrowDown2 size={20} variant="Linear" color="var(--sd-grey-12)" />
        </button>

        <div className="mt-[8px] flex flex-col">
          {lessonItems.map((lesson) => {
            const Icon = lesson.icon

            return (
              <button
                key={lesson.label}
                type="button"
                className={cn(
                  'flex h-[32px] items-center rounded-[6px] px-[12px] text-left',
                  lesson.active && 'bg-sd-grey-3',
                )}
              >
                <span className="flex w-full items-center gap-[8px]">
                  <Icon size={16} variant="Linear" color="var(--sd-grey-11)" />
                  <span className="min-w-0 flex-1 truncate text-[14px] font-normal leading-[20px] text-sd-grey-11">
                    {lesson.label}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {['Module 2', 'Module 3', 'Module 4'].map((module) => (
        <button
          key={module}
          type="button"
          className="flex h-[36px] items-center justify-between rounded-[8px] border border-sd-grey-4 bg-sd-grey-1 px-[12px] text-left"
        >
          <span className="text-[14px] font-normal leading-[20px] text-sd-grey-12">
            {module}
          </span>
          <ArrowRight2 size={20} variant="Linear" color="var(--sd-grey-11)" />
        </button>
      ))}
    </div>
  )
}
"""

if "QuizModuleRail" not in content:
    script_field_start = content.find("const ScriptField = ({")
    if script_field_start != -1:
        content = content[:script_field_start] + rails + "\n" + content[script_field_start:]
        print("Patched rails")
    else:
        content = content + rails
        print("Patched rails at end")
else:
    print("Rails already in file")

with open(file_path, "w") as f:
    f.write(content)
