import React from "react";

export const PrivacyTab = () => {
  return (
    <div className="flex flex-col gap-[20px]">
      <h2 className="text-[20px] font-semibold text-[#202020] tracking-[-0.4px] leading-[28px]">Privacy Policy</h2>

      <div className="flex flex-col gap-[16px] text-[14px] text-[#636363] leading-[22px]">
        <p>
          Welcome to SoluDesks. We value your privacy and are committed to protecting your
          personal information. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you use our platform.
        </p>
        <p>
          <strong className="text-[#202020]">Information We Collect</strong><br />
          We collect information you provide directly to us, such as when you create an account,
          update your profile, create courses, or contact us for support.
        </p>
        <p>
          <strong className="text-[#202020]">How We Use Your Information</strong><br />
          We use the information we collect to provide, maintain, and improve our services,
          process transactions, send you technical notices, and respond to your comments and
          questions.
        </p>
        <p>
          <strong className="text-[#202020]">Data Security</strong><br />
          We take reasonable measures to help protect information about you from loss, theft,
          misuse, and unauthorized access, disclosure, alteration, and destruction.
        </p>
        <p>
          <strong className="text-[#202020]">Terms of Service</strong><br />
          By using SoluDesks, you agree to be bound by these Terms. Please read them carefully
          before using the platform. Your continued use of the service constitutes acceptance
          of any changes to these Terms.
        </p>
        <p>
          <strong className="text-[#202020]">Contact Us</strong><br />
          If you have any questions about this Privacy Policy or our Terms of Service, please
          contact us at support@soludesks.com.
        </p>
      </div>
    </div>
  );
};
