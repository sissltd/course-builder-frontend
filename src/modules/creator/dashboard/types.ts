export interface CreatorOverviewCourseCounts {
  DRAFT: number;
  SUBMITTED: number;
  IN_REVIEW: number;
  NEEDS_REVISION: number;
  APPROVED: number;
  PUBLISHED: number;
  ARCHIVED: number;
  REJECTED: number;
}

export interface CreatorOverviewWallet {
  balance: string;
  currency: string;
  total_earned: string;
  pending_balance: string;
}

export interface CreatorOverviewResponse {
  courses: CreatorOverviewCourseCounts;
  wallet: CreatorOverviewWallet;
  pending_invites: number;
}

export interface QualityCheckCriterion {
  id: string;
  section: string;
  label: string;
  order_index: number;
  is_active: boolean;
}

export interface QualityCheckResult {
  id: string;
  criterion: QualityCheckCriterion;
  is_checked: boolean;
  warning_note: string | null;
  checked_at: string | null;
}
