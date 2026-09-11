"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SettingsLayout } from "@/components/shared/SettingsLayout";
import { FullscreenLayout } from "@/components/shared/FullscreenLayout";
import { HelpTabNav, type HelpTab } from "./components/HelpTabNav";
import { NewToSoludeskTab } from "./components/NewToSoludeskTab";
import {
  KnowledgeBaseTab,
  type KnowledgeBaseCategory,
} from "./components/KnowledgeBaseTab";
import { SupportTab } from "./components/SupportTab";
import { KnowledgeBaseCategoryPage } from "./components/KnowledgeBaseCategoryPage";
import { ArticleDetailPage } from "./components/ArticleDetailPage";
import { AppealFormPage } from "./components/AppealFormPage";
import { AppealSuccessModal } from "./components/AppealSuccessModal";

const categoryLabels: Record<KnowledgeBaseCategory, string> = {
  "course-creation": "Course creation",
  "submission-review": "Submission & review",
  "topic-reservation": "Topic reservation",
  "wallet-payments": "Wallet & payments",
  "creator-tier-pricing": "Creator tier pricing",
  "draft-management": "Draft management",
  onboarding: "Onboarding & getting started",
};

export const HelpView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = (searchParams.get("tab") as HelpTab) || "new-to-soludesk";
  const category = searchParams.get("category") as KnowledgeBaseCategory | null;
  const articleId = searchParams.get("article");
  const view = searchParams.get("view");

  const isSubPage = !!category || !!articleId || view === "appeal";

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/creator/help?${params.toString()}`);
  };

  const handleTabChange = (newTab: HelpTab) => {
    updateParams({ tab: newTab, category: null, article: null, view: null });
  };

  const handleCategorySelect = (cat: KnowledgeBaseCategory) => {
    updateParams({ category: cat, article: null, view: null });
  };

  const handleArticleSelect = (id: string) => {
    updateParams({ article: id });
  };

  const handleBackToCategory = () => {
    updateParams({ article: null });
  };

  const handleBackToKnowledgeBase = () => {
    updateParams({ category: null, article: null });
  };

  const handleRequestAppeal = () => {
    updateParams({ view: "appeal", category: null, article: null });
  };

  const handleBackToSupport = () => {
    updateParams({ view: null, tab: "support" });
  };

  const handleGoHome = () => {
    updateParams({ tab: "new-to-soludesk", category: null, article: null, view: null });
  };

  const renderMainContent = () => {
    switch (tab) {
      case "new-to-soludesk":
        return <NewToSoludeskTab />;
      case "knowledge-base":
        return (
          <KnowledgeBaseTab onCategorySelect={handleCategorySelect} />
        );
      case "support":
        return <SupportTab onRequestAppeal={handleRequestAppeal} />;
      default:
        return null;
    }
  };

  if (isSubPage) {
    if (category && !articleId) {
      return (
        <>
          <FullscreenLayout
            backLabel={categoryLabels[category]}
            onBack={handleBackToKnowledgeBase}
          >
            <KnowledgeBaseCategoryPage
              category={category}
              onArticleSelect={handleArticleSelect}
            />
          </FullscreenLayout>
          <AppealSuccessModal
            isOpen={false}
            onOpenChange={() => {}}
            onGoHome={handleGoHome}
          />
        </>
      );
    }

    if (articleId && category) {
      return (
        <>
          <FullscreenLayout
            backLabel={categoryLabels[category]}
            onBack={handleBackToCategory}
          >
            <ArticleDetailPage />
          </FullscreenLayout>
          <AppealSuccessModal
            isOpen={false}
            onOpenChange={() => {}}
            onGoHome={handleGoHome}
          />
        </>
      );
    }

    if (view === "appeal") {
      return (
        <>
          <FullscreenLayout backLabel="Support" onBack={handleBackToSupport}>
            <AppealFormPage
              onSubmitSuccess={() =>
                updateParams({ view: "appeal-success" })
              }
            />
          </FullscreenLayout>
          <AppealSuccessModal
            isOpen={false}
            onOpenChange={() => {}}
            onGoHome={handleGoHome}
          />
        </>
      );
    }

    if (view === "appeal-success") {
      return (
        <>
          <FullscreenLayout backLabel="Support" onBack={handleBackToSupport}>
            <AppealFormPage
              onSubmitSuccess={() =>
                updateParams({ view: "appeal-success" })
              }
            />
          </FullscreenLayout>
          <AppealSuccessModal
            isOpen={true}
            onOpenChange={() => {}}
            onGoHome={handleGoHome}
          />
        </>
      );
    }
  }

  return (
    <>
      <SettingsLayout
        heading="Help"
        nav={<HelpTabNav active={tab} onChange={handleTabChange} />}
        navClassName="w-full md:w-[326px] px-[16px] py-[20px]"
        contentClassName="px-[40px] py-[32px]"
      >
        {renderMainContent()}
      </SettingsLayout>
      <AppealSuccessModal
        isOpen={false}
        onOpenChange={() => {}}
        onGoHome={handleGoHome}
      />
    </>
  );
};
