const fs = require('fs');
const path = require('path');

const dir = 'src/modules/reviewer/settings/components';
const files = [
  'AccountTab.tsx',
  'AvailabilityTab.tsx',
  'QueueBehaviourTab.tsx',
  'NotificationsTab.tsx',
  'LoginSecurityTab.tsx',
  'DataPrivacyTab.tsx'
];

const replacements = [
  {
    from: /text-\[24px\] font-medium leading-\[32px\] text-sd-grey-12/g,
    to: 'text-[22px] font-medium leading-[32px] tracking-[-0.48px] text-sd-grey-12'
  },
  {
    from: /text-\[14px\] font-normal leading-\[20px\] text-sd-grey-11/g,
    to: 'text-[14px] font-normal leading-[24px] tracking-[-0.28px] text-sd-grey-11'
  },
  {
    from: /text-\[12px\] font-medium uppercase tracking-\[-0.24px\] leading-\[16px\] text-sd-reviewer-muted/g,
    to: 'mb-[20px] block text-[14px] font-medium uppercase leading-[20px] tracking-[-0.28px] text-sd-grey-12'
  },
  {
    from: /text-\[14px\] font-medium leading-\[20px\] text-sd-grey-12/g,
    to: 'text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12'
  },
  {
    from: /text-\[14px\] font-normal leading-\[20px\] text-sd-reviewer-muted/g,
    to: 'text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11'
  },
  {
    from: /size-\[64px\] items-center justify-center rounded-full bg-sd-grey-12 text-\[20px\] font-medium/g,
    to: 'size-[56px] items-center justify-center rounded-full bg-sd-grey-12 text-[18px] font-normal leading-[28px] tracking-[-0.36px]'
  },
  {
    from: /text-\[18px\] font-semibold leading-\[24px\] text-sd-grey-12/g,
    to: 'text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12'
  },
  {
    from: /rounded-\[4px\] bg-\[#FFF8E6\] px-\[8px\] py-\[2px\] text-\[12px\] font-medium leading-\[16px\] text-\[#F59E0B\]/g,
    to: 'rounded-[8px] bg-sd-warning-bg px-[10px] py-[4px] text-[12px] font-medium leading-[16px] text-sd-warning-text'
  },
  {
    from: /text-\[16px\] font-semibold leading-\[24px\] text-sd-grey-12/g,
    to: 'text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12'
  }
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  replacements.forEach(({from, to}) => {
    content = content.replace(from, to);
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
