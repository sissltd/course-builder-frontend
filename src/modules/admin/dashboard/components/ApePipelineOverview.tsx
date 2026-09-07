import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useGetAdminPipelineQuery } from "@/redux/slices/adminApi";

const STAGE_COLORS = [
  "#0063EF",
  "#FF8A00",
  "#00C48C",
  "#FF3D57",
  "#7C3AED",
  "#F59E0B",
  "#14B8A6",
  "#8B5CF6",
];

export const ApePipelineOverview = () => {
  const { data, isLoading } = useGetAdminPipelineQuery();

  const chartData = React.useMemo(() => {
    const stages = data?.stages || [];
    return stages.map((s, index) => ({
      name: s.label,
      value: s.completed || s.total || 0,
      color: STAGE_COLORS[index % STAGE_COLORS.length],
    }));
  }, [data]);

  const total = React.useMemo(
    () => chartData.reduce((sum, d) => sum + d.value, 0),
    [chartData]
  );

  return (
    <div className="bg-[#FDFDFD] border border-[#F0F0F0] rounded-[12px] p-[24px] flex-1 min-w-[320px] h-[fit-content]">
      <div className="flex items-center justify-between mb-[24px]">
        <h3 className="text-[14px] font-normal text-[#606060] tracking-[-0.28px] leading-[20px]">
          APE Pipeline Overview
        </h3>
        <span className="text-[12px] text-[#888]">
          {total > 0 ? `${total} Total Units` : "No jobs"}
        </span>
      </div>
      <div className="flex flex-col items-center gap-[24px] w-full">
        <div className="relative w-full h-[260px] flex items-center justify-center">
          {isLoading ? (
            <div className="w-[180px] h-[180px] rounded-full border-8 border-[#F0F0F0] border-t-[#0063EF] animate-spin" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  {total > 0 ? (
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={105}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  ) : (
                    <Pie
                      data={[{ name: "No Jobs", value: 1 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={105}
                      dataKey="value"
                      fill="#F0F0F0"
                      stroke="none"
                      isAnimationActive={false}
                    />
                  )}
                  {total > 0 && (
                    <Tooltip
                      contentStyle={{
                        background: "#202020",
                        border: "none",
                        borderRadius: "8px",
                        color: "#FDFDFD",
                        fontSize: "13px",
                        padding: "8px 12px",
                      }}
                      formatter={(value) => [
                        `${Number(value)} (${Math.round((Number(value) / total) * 100)}%)`,
                        "",
                      ]}
                    />
                  )}
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Donut Badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[24px] font-semibold text-[#202020] leading-[28px]">
                  {total}
                </span>
                <span className="text-[12px] font-normal text-[#606060] leading-[16px]">
                  {total === 1 ? "Job" : "Jobs"}
                </span>
              </div>
            </>
          )}
        </div>

        {chartData.length > 0 && (
          <div className="flex flex-wrap gap-x-[20px] gap-y-[10px] justify-center max-h-[140px] overflow-y-auto w-full">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-[6px]">
                <div
                  className="size-[8px] rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[12px] font-normal text-[#606060] leading-[16px] whitespace-nowrap">
                  {item.name}
                </span>
                <span className="text-[12px] font-medium text-[#202020] leading-[16px]">
                  {total > 0 ? `${Math.round((item.value / total) * 100)}%` : "0%"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
