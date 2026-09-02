import {
  ArrowDown2,
  ArrowUp2,
  Calendar2,
  Copy,
  Money,
  MoneyTime,
  SearchNormal1,
  Sort,
  Wallet,
} from "iconsax-react";
import Image from "next/image";

import { CREATOR_TRANSACTIONS, WALLET_STATS } from "@/modules/website/data/content";

const TRANSACTION_CHIP: Record<string, string> = {
  Pending: "bg-[#EBF3FE] text-[#0A60E1]",
  Successful: "bg-[#F1F8F2] text-[#3C7E44]",
  Failed: "bg-[#FFECEB] text-[#FC5049]",
};

const WALLET_ICONS = [Money, Wallet, MoneyTime];

const WALLET_ROWS = [
  { description: "Fundamentals of programming", amount: "₦5", type: "Credit", status: "Pending" },
  { description: "Version Control and Collaboration", amount: "₦500", type: "Withdrawal", status: "Successful" },
  { description: "Deployment and Maintenance Strategies", amount: "₦5", type: "Credit", status: "Failed" },
  { description: "Deployment and Maintenance Strategies", amount: "₦5", type: "Credit", status: "Pending" },
  { description: "Deployment and Maintenance Strategies", amount: "₦5", type: "Credit", status: "Successful" },
  { description: "Deployment and Maintenance Strategies", amount: "₦5", type: "Credit", status: "Pending" },
];

const FilterChip = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-10 shrink-0 items-center gap-3 overflow-clip rounded-[8px] border border-[#D9D9D9] px-4">
    {children}
  </div>
);

export function CreatorsWalletSection() {
  return (
    <section className="relative overflow-hidden bg-white lg:h-[652px] lg:pt-[70px]">
      <div
        aria-hidden
        className="absolute inset-0 -mx-6 md:-mx-10 lg:-mx-[120px]"
        style={{
          backgroundImage:
            "linear-gradient(169.32deg, #FFFFFF 22.01%, #FFF3E5 48.95%, #FFFFFF 78.64%)",
        }}
      />

      <div className="relative flex w-full flex-col items-center gap-[40px] pt-[56px] lg:gap-[60px] lg:pt-0 lg:pb-[70px]">
        <h2 className="w-full max-w-[481px] text-center text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
          Get paid doing what you love the most
        </h2>

        <div className="flex w-full flex-col lg:h-[356px] lg:flex-row">
          <div className="relative w-full overflow-clip bg-white lg:h-[356px] lg:w-1/2">
            <Image
              src="/images/products/creators/wallet-ellipse-24.svg"
              alt=""
              width={373}
              height={267}
              className="pointer-events-none absolute left-[49px] top-[51px] hidden h-auto w-[373px] max-w-none -rotate-30 lg:block"
            />

            <div className="relative flex flex-col gap-3 rounded-[16px] border border-[#F0F0F0] bg-[#FDFDFD] px-4 py-5 lg:absolute lg:left-[166px] lg:top-[90px] lg:w-[350px]">
              <p className="text-[14px] font-semibold leading-5 tracking-[-0.28px] text-[#606060]">
                Transaction activity
              </p>
              <div className="flex w-full flex-col gap-5">
                {CREATOR_TRANSACTIONS.map((transaction) => (
                  <div
                    key={`${transaction.title}-${transaction.amount}`}
                    className="flex w-full items-start justify-between gap-4"
                  >
                    <div className="flex min-w-0 flex-col items-start justify-between whitespace-nowrap">
                      <p className="w-full truncate text-[14px] leading-5 tracking-[-0.28px] text-sd-black">
                        {transaction.title}
                      </p>
                      <p className="w-full truncate text-[12px] leading-4 text-[#606060]">
                        {transaction.date}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <p className="text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                        {transaction.amount}
                      </p>
                      <span
                        className={`flex items-center justify-center rounded-[6px] px-1.5 py-1 text-[12px] leading-4 ${TRANSACTION_CHIP[transaction.status]}`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative -mx-3 -mt-4 mb-4 flex h-[112px] w-full items-center justify-between rounded-[13px] bg-white px-[19.6px] py-[9.8px] shadow-[0_45.785px_45.785px_rgba(0,0,0,0.09)] lg:absolute lg:left-[99px] lg:top-[15px] lg:m-0 lg:w-[400px] lg:-rotate-[4.62deg] lg:skew-x-10 lg:scale-y-[0.98]">
              <div className="flex items-center gap-[5.45px]">
                <Image
                  src="/images/products/creators/wallet-toast-avatar.png"
                  alt=""
                  width={37}
                  height={42}
                  className="h-[42.5px] w-[37px] object-contain"
                />
                <div className="flex flex-col items-start px-[10.9px] py-[8.7px]">
                  <p className="text-[17.4px] font-medium leading-[26.2px] tracking-[-0.35px] text-[#606060]">
                    Wallet credited
                  </p>
                  <p className="text-[12px] leading-4 text-[#606060]">23 Mar 2026, 10:34 PM</p>
                </div>
              </div>
              <p className="text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">+₦500.00</p>
            </div>
          </div>

          <div className="relative w-full overflow-clip border-l border-[#F0F0F0] bg-white lg:h-[356px] lg:w-1/2">
            <Image
              src="/images/products/creators/wallet-ellipse-25.svg"
              alt=""
              width={440}
              height={128}
              className="pointer-events-none absolute left-[31px] top-[89px] hidden h-auto w-[440px] max-w-none lg:block"
            />

            <div className="relative w-full overflow-clip rounded-tl-[24px] bg-[#F2F2F2] lg:absolute lg:left-[74px] lg:top-[51px] lg:h-[470px] lg:w-[580px]">
              <div className="flex w-full flex-col gap-5 p-5 lg:w-[1232px]">
                <p className="text-[24px] font-semibold leading-8 tracking-[-0.48px] text-sd-black">
                  Wallet
                </p>

                <div className="flex w-full flex-col gap-4 overflow-clip rounded-[20px] border-[1.5px] border-[#F0F0F0] bg-[#FDFDFD] px-4 py-5">
                  <p className="text-[20px] font-semibold leading-7 text-sd-black">
                    Creator&apos;s overview
                  </p>
                  <div className="flex w-full items-center gap-[11px]">
                    {WALLET_STATS.map((stat, index) => {
                      const StatIcon = WALLET_ICONS[index];
                      return (
                        <div
                          key={stat.label}
                          className="flex h-[86px] min-w-px flex-1 items-center gap-3 rounded-[12px] border border-[#E8E8E8] px-4 py-3"
                        >
                          <div className="flex size-[50px] shrink-0 items-center justify-center rounded-[8px] border border-[#E8E8E8] bg-[#FDFDFD] p-[10.9px]">
                            <StatIcon variant="Bulk" color="#0A60E1" size={28} />
                          </div>
                          <div className="flex min-w-0 flex-col gap-2">
                            <p className="truncate text-[16px] leading-6 tracking-[-0.32px] text-[#606060]">
                              {stat.label}
                            </p>
                            <p className="truncate text-[16px] leading-6 tracking-[-0.32px] text-sd-black">
                              {stat.value}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex h-12 w-fit items-center justify-center gap-2 rounded-[8px] border border-[#0063EF] px-4 py-3">
                    <ArrowUp2 variant="Linear" color="#0063EF" size={24} />
                    <span className="text-[14px] leading-5 tracking-[-0.28px] text-[#0063EF]">
                      Withdraw earnings
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-col items-end gap-4 overflow-clip rounded-[20px] border border-[#F0F0F0] bg-[#FDFDFD] px-4 pb-4 pt-5">
                  <div className="flex w-full items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-[308px] items-center gap-3 overflow-clip rounded-[8px] border border-[#D9D9D9] px-4">
                        <SearchNormal1 variant="Linear" color="#202020" size={20} />
                        <span className="text-[14px] leading-5 tracking-[-0.28px] text-[#B6B6B6]">
                          Search transaction
                        </span>
                      </div>
                      <FilterChip>
                        <Sort variant="Linear" color="#202020" size={20} />
                        <span className="text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                          Status
                        </span>
                        <ArrowDown2 variant="Linear" color="#202020" size={20} />
                      </FilterChip>
                      <FilterChip>
                        <Sort variant="Linear" color="#202020" size={20} />
                        <span className="text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                          Type
                        </span>
                        <ArrowDown2 variant="Linear" color="#202020" size={20} />
                      </FilterChip>
                    </div>
                    <FilterChip>
                      <Calendar2 variant="Linear" color="#202020" size={20} />
                      <span className="text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                        Date
                      </span>
                    </FilterChip>
                  </div>

                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr>
                        {["REFERENCE", "DESCRIPTION", "DATE", "AMOUNT", "STATUS", "Type"].map(
                          (head) => (
                            <th
                              key={head}
                              className="h-[48px] border-b border-[#F0F0F0] bg-[#FDFDFD] p-4 text-[14px] font-normal leading-5 tracking-[-0.28px] text-sd-black"
                            >
                              {head}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {WALLET_ROWS.map((row, index) => (
                        <tr key={`${row.description}-${index}`} className="border-b border-[#F0F0F0]">
                          <td className="h-[56px] p-4">
                            <span className="flex items-center gap-2">
                              <span className="max-w-[160px] truncate text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                                EARSF4FCkeeEqgB5nnLjt32wqMgaFJrNsnT
                              </span>
                              <Copy variant="Linear" color="#202020" size={16} />
                            </span>
                          </td>
                          <td className="p-4 text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                            {row.description}
                          </td>
                          <td className="whitespace-nowrap p-4 text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                            23 Mar 2026, 10:34 PM
                          </td>
                          <td className="p-4 text-[14px] leading-5 tracking-[-0.28px] text-sd-black">
                            {row.amount}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center justify-center rounded-[6px] px-2 py-1 text-[12px] leading-4 ${TRANSACTION_CHIP[row.status]}`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap p-4 text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                            {row.type}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex shrink-0 items-center gap-[15px]">
                    <span className="p-[10px] text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                      Previous
                    </span>
                    <div className="flex items-center gap-[7px]">
                      {[1, 2, 3, 4, 5].map((page) => (
                        <span
                          key={page}
                          className={`flex size-8 items-center justify-center rounded-[6px] px-2 py-0.5 text-[14px] leading-5 tracking-[-0.28px] ${
                            page === 3
                              ? "bg-[#0A60E1] text-[#FCFDFF]"
                              : "border border-[#D9D9D9] text-[#606060]"
                          }`}
                        >
                          {page}
                        </span>
                      ))}
                    </div>
                    <span className="p-[10px] text-[14px] leading-5 tracking-[-0.28px] text-sd-black">
                      Next
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
