"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button as AppButton } from "@/components/shared/Button";
import { cn } from "@/lib/utils";
import { normalizeApiError } from "@/lib/api/errors";
import { usePermissions } from "@/modules/auth/hooks/usePermissions";
import { PERMISSION } from "@/modules/auth/permissions";
import {
  useGetPermissionGroupsQuery,
  useGetRolesQuery,
  useUpdateRoleMutation,
} from "@/modules/admin/roles/api/rolesApi";
import type { RoleCard } from "@/modules/admin/roles/types";
import { AddRoleModal } from "./AddRoleModal";
import { DeleteRoleModal } from "./DeleteRoleModal";
import { RenameRoleModal } from "./RenameRoleModal";

const RoleCardMenu = ({
  role,
  onEdit,
  onDelete,
}: {
  role: RoleCard;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="absolute right-0 top-[44px] z-20 w-[148px] rounded-[12px] border border-sd-grey-3 bg-white p-[8px] shadow-[0px_8px_20px_0px_rgba(0,0,0,0.14)]">
    <div className="flex flex-col gap-[2px]">
      {/* Built-in roles reject a rename — the endpoint accepts `name` on
          custom roles only. */}
      {!role.is_system && (
        <AppButton
          type="button"
          variant="ghost"
          size="sm"
          className="h-[34px] justify-start rounded-[8px] px-[10px] text-[12px] font-normal text-sd-grey-11 hover:bg-sd-grey-1"
          onClick={onEdit}
        >
          Edit role
        </AppButton>
      )}
      {role.is_deletable && (
        <AppButton
          type="button"
          variant="ghost"
          size="sm"
          className="h-[34px] justify-start rounded-[8px] px-[10px] text-[12px] font-normal text-sd-danger hover:bg-sd-danger-soft"
          onClick={onDelete}
        >
          Delete role
        </AppButton>
      )}
    </div>
  </div>
);

const PermissionPill = ({
  label,
  description,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  description?: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={
      disabled
        ? "You cannot grant a permission you do not hold yourself"
        : description
    }
    className={cn(
      "inline-flex h-[34px] items-center gap-[8px] rounded-[8px] border px-[12px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] transition-colors",
      disabled
        ? "cursor-not-allowed border-sd-grey-3 bg-sd-grey-1 text-sd-grey-8"
        : "cursor-pointer",
      !disabled &&
        (selected
          ? "border-sd-blue bg-sd-blue text-white"
          : "border-sd-grey-3 bg-white text-sd-grey-11 hover:bg-sd-grey-1"),
    )}
  >
    <span>{label}</span>
    {selected && <CheckCircle2 size={16} strokeWidth={2} />}
  </button>
);

/**
 * Roles & Permissions, backed by `GET /admin/roles/` and
 * `GET /admin/permissions/`.
 *
 * Both endpoints load together: the role cards carry permission *codenames*
 * only, and the groups endpoint is what turns those into labelled chips and
 * says which of them the caller may grant (`grantable_by_you`). Nothing about
 * the grouping, labels or ordering is hardcoded here — the backend returns the
 * design's groups first and its own extras after, and the codenames are the
 * stable part ("labels may change").
 *
 * Edits are a draft held locally and sent with Save, because `PATCH` replaces
 * the **complete** permission set rather than patching it — toggling straight
 * through to the network would send a full set on every click.
 */
export const PermissionsTab = () => {
  const { can } = usePermissions();
  const canManage = can(PERMISSION.ROLES_MANAGE);

  const {
    data: roles,
    isLoading: isRolesLoading,
    isError: isRolesError,
  } = useGetRolesQuery();
  const { data: groups, isLoading: isGroupsLoading } =
    useGetPermissionGroupsQuery();
  const [updateRole, { isLoading: isSaving }] = useUpdateRoleMutation();

  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{
    roleId: string;
    permissions: Set<string>;
  } | null>(null);
  const [openMenuRoleId, setOpenMenuRoleId] = useState<string | null>(null);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [renamingRole, setRenamingRole] = useState<RoleCard | null>(null);
  const [deletingRole, setDeletingRole] = useState<RoleCard | null>(null);

  const roleList = useMemo(() => roles ?? [], [roles]);

  // Falls back to the first role — the API returns built-ins first, in the
  // platform's order — so no effect is needed to seed the selection.
  const activeRole = useMemo(
    () => roleList.find((role) => role.id === activeRoleId) ?? roleList[0] ?? null,
    [roleList, activeRoleId],
  );

  const savedPermissions = useMemo(
    () => new Set(activeRole?.permissions ?? []),
    [activeRole?.permissions],
  );

  // A draft only counts for the role it was made against; switching roles
  // discards it rather than applying one role's chips to another.
  const selected =
    draft && draft.roleId === activeRole?.id
      ? draft.permissions
      : savedPermissions;

  const isDirty = useMemo(() => {
    if (!draft || draft.roleId !== activeRole?.id) return false;
    if (draft.permissions.size !== savedPermissions.size) return true;
    for (const codename of draft.permissions) {
      if (!savedPermissions.has(codename)) return true;
    }
    return false;
  }, [draft, activeRole?.id, savedPermissions]);

  const isEditable = canManage && !!activeRole?.can_edit;

  const handleToggle = (codename: string) => {
    if (!activeRole || !isEditable) return;
    const next = new Set(selected);
    if (next.has(codename)) {
      next.delete(codename);
    } else {
      next.add(codename);
    }
    setDraft({ roleId: activeRole.id, permissions: next });
  };

  const handleSave = async () => {
    if (!activeRole || !isDirty) return;

    try {
      await updateRole({
        id: activeRole.id,
        body: { permissions: [...selected] },
      }).unwrap();

      toast.success(`Permissions updated for “${activeRole.name}”`, {
        description:
          "Members pick this up on their next request — nobody is signed out.",
      });
      setDraft(null);
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not update the role");
    }
  };

  if (isRolesLoading || isGroupsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-[#0063EF]" />
      </div>
    );
  }

  if (isRolesError) {
    return (
      <div className="flex flex-col gap-[6px] py-12">
        <h3 className="text-[16px] font-medium text-sd-grey-12">
          Could not load roles
        </h3>
        <p className="text-[14px] text-sd-grey-11">
          Reading roles needs the <code>roles.view</code> permission. If you
          believe you should have it, ask a Super Admin.
        </p>
      </div>
    );
  }

  return (
    <>
      <AddRoleModal
        isOpen={isAddRoleOpen}
        onOpenChange={setIsAddRoleOpen}
        onCreated={(roleId) => {
          if (roleId) {
            setActiveRoleId(roleId);
            setDraft(null);
          }
        }}
      />
      <RenameRoleModal
        key={renamingRole?.id ?? "rename-role"}
        isOpen={!!renamingRole}
        onOpenChange={(open) => {
          if (!open) setRenamingRole(null);
        }}
        role={renamingRole}
      />
      <DeleteRoleModal
        key={deletingRole?.id ?? "delete-role"}
        isOpen={!!deletingRole}
        onOpenChange={(open) => {
          if (!open) setDeletingRole(null);
        }}
        role={deletingRole}
        roles={roleList}
        onDeleted={() => setActiveRoleId(null)}
      />

      <div className="flex w-full flex-col gap-[34px]">
        <div className="flex items-start justify-between gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <h3 className="text-[22px] font-medium text-sd-grey-12 tracking-[-0.44px] leading-[32px]">
              Roles &amp; Permissions
            </h3>
            <p className="text-[14px] font-normal text-sd-grey-11 leading-[24px]">
              Manage team members, assign roles, and control access levels
            </p>
          </div>

          {canManage && (
            <AppButton
              type="button"
              variant="app-primary"
              size="app"
              className="h-[40px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
              onClick={() => setIsAddRoleOpen(true)}
            >
              Add Role
            </AppButton>
          )}
        </div>

        <div className="grid grid-cols-4 gap-[12px]">
          {roleList.map((role) => (
            <div
              key={role.id}
              className="relative flex h-[42px] items-center justify-between rounded-[10px] border border-sd-grey-3 bg-white px-[12px]"
            >
              <button
                type="button"
                onClick={() => setActiveRoleId(role.id)}
                className={cn(
                  "flex-1 truncate pr-[10px] text-left text-[14px] font-normal leading-[20px] tracking-[-0.28px] cursor-pointer",
                  activeRole?.id === role.id
                    ? "text-sd-grey-12"
                    : "text-sd-grey-14",
                )}
              >
                {role.name}
              </button>

              {role.can_edit && (
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenuRoleId((current) =>
                      current === role.id ? null : role.id,
                    )
                  }
                  className="ml-[10px] text-sd-grey-11"
                  aria-label={`${role.name} menu`}
                >
                  <MoreHorizontal size={18} strokeWidth={2} />
                </button>
              )}

              {openMenuRoleId === role.id && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setOpenMenuRoleId(null)}
                    aria-label="Close role menu"
                  />
                  <RoleCardMenu
                    role={role}
                    onEdit={() => {
                      setOpenMenuRoleId(null);
                      setRenamingRole(role);
                    }}
                    onDelete={() => {
                      setOpenMenuRoleId(null);
                      setDeletingRole(role);
                    }}
                  />
                </>
              )}
            </div>
          ))}
        </div>

        <div className="overflow-x-auto border-b border-sd-grey-3">
          <div className="flex min-w-max items-end gap-[10px]">
            {roleList.map((role) => {
              const isActive = activeRole?.id === role.id;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRoleId(role.id)}
                  className={cn(
                    "relative h-[40px] shrink-0 px-[12px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] cursor-pointer",
                    isActive ? "text-sd-grey-12" : "text-sd-muted-text",
                  )}
                >
                  {role.name}
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-sd-grey-12" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {activeRole && (
          <div className="flex items-center justify-between gap-[16px]">
            <span className="text-[13px] text-sd-grey-9">
              {activeRole.base_role_label} · {activeRole.member_count}{" "}
              {activeRole.member_count === 1 ? "member" : "members"}
              {activeRole.is_system ? " · built-in" : ""}
              {!activeRole.can_edit ? " · read-only for you" : ""}
            </span>

            {isDirty && (
              <div className="flex items-center gap-[10px]">
                <span className="text-[13px] text-sd-grey-9">
                  Unsaved changes
                </span>
                <AppButton
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSaving}
                  className="h-[34px] rounded-[8px] px-[14px] text-[13px]"
                  onClick={() => setDraft(null)}
                >
                  Discard
                </AppButton>
                <AppButton
                  type="button"
                  variant="app-primary"
                  size="sm"
                  disabled={isSaving}
                  className="h-[34px] rounded-[8px] px-[14px] text-[13px]"
                  onClick={handleSave}
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </AppButton>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-[22px]">
          {(groups ?? []).map((group) => {
            const permissions = group.permissions ?? [];

            return (
              <div key={group.key} className="flex flex-col gap-[12px]">
                <h4 className="text-[14px] font-medium text-sd-grey-12 leading-[24px] tracking-[-0.28px]">
                  {group.label}
                </h4>

                <div className="flex flex-wrap gap-[12px]">
                  {permissions.length > 0 ? (
                    permissions.map((permission) => (
                      <PermissionPill
                        key={permission.codename}
                        label={permission.label}
                        description={permission.description}
                        selected={selected.has(permission.codename)}
                        disabled={!isEditable || !permission.grantable_by_you}
                        onClick={() => handleToggle(permission.codename)}
                      />
                    ))
                  ) : (
                    <span className="text-[14px] font-normal text-sd-muted-text leading-[20px] tracking-[-0.28px]">
                      No permission
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
