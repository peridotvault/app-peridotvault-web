"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
  Dropdown,
  OptionComponent,
} from "@/shared/components/ui/atoms/Dropdown";
import { SearchInput } from "@/shared/components/ui/molecules/SearchInput";
import { STYLE_PADDING } from "@/shared/constants/style";
import { useGetChains } from "@/features/chain/hooks/useGetChain";
import { useNetwork } from "@/features/setting/hooks/useNetwork";
import { useSelectedChain } from "@/features/setting/hooks/useSelectedChain";
import { useGetCategories } from "@/features/game/hooks/category.hook";
import { getAssetUrl } from "@/shared/utils/helper.url";
import { IMAGE_LOADING } from "@/shared/constants/image";
import { useModal } from "@/core/ui-system/modal/modal.store";
import ModalShell from "@/core/ui-system/modal/ModalShell";
import { Category } from "@/features/game/types/category.type";
import clsx from "clsx";
import { ButtonWithSound } from "../atoms/ButtonWithSound";
import { useClickSound } from "@/shared/hooks/useClickSound";
import { EmbedLink } from "@/features/security/embed/embed.component";

type NavMenu = "browse" | "categories" | null;

export const VaultNavbar = () => {
  const [query, setQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<NavMenu>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const activeModalIdRef = useRef<string | null>(null);

  const closeModal = useModal((s) => s.close);
  const { network } = useNetwork();
  const { chains } = useGetChains();
  const { chainId, setSelectedChain } = useSelectedChain();
  const { categories, isLoading: isLoadingCategories } = useGetCategories();

  const filteredChains = chains.filter((c) => {
    if (network === "testnet") return c.is_testnet;
    if (network === "mainnet") return !c.is_testnet;
    return true;
  });

  const selectedChain =
    filteredChains.find((c) => c.caip_2_id === chainId) ?? filteredChains[0];

  const options: OptionComponent[] = filteredChains.map((c) => ({
    value: c.caip_2_id,
    label: c.name,
    imageUrl: c.icon_url,
  }));

  useEffect(() => {
    return () => {
      if (activeModalIdRef.current) {
        useModal.getState().close(activeModalIdRef.current);
      }
    };
  }, []);

  const closeNavMenu = () => {
    const modalId = activeModalIdRef.current;
    activeModalIdRef.current = null;
    setActiveMenu(null);

    if (modalId) {
      closeModal(modalId);
    }
  };

  const openNavMenu = (menu: Exclude<NavMenu, null>) => {
    if (activeMenu === menu) {
      closeNavMenu();
      return;
    }

    if (activeModalIdRef.current) {
      closeModal(activeModalIdRef.current);
      activeModalIdRef.current = null;
    }

    const panelTop = navRef.current?.getBoundingClientRect().bottom ?? 0;

    const modalId = useModal.getState().open((id) => (
      <ModalShell
        id={id}
        centered={false}
        containerClassName="fixed inset-0 z-50 pointer-events-none"
        backdropClassName="pointer-events-auto bg-black/20"
        backdropStyle={{ top: panelTop }}
        panelClassName="pointer-events-auto absolute inset-x-0 rounded-none border-x-0 border-b border-t bg-card shadow-2xl shadow-black/25"
        panelStyle={{ top: panelTop }}
        onCloseStart={() => {
          activeModalIdRef.current = null;
          setActiveMenu((current) => (current === menu ? null : current));
        }}
      >
        {menu === "browse" ? (
          <BrowseMenu
            categories={categories}
            isLoading={isLoadingCategories}
            onNavigate={closeNavMenu}
          />
        ) : (
          <CategoriesMenu
            categories={categories}
            isLoading={isLoadingCategories}
            onNavigate={closeNavMenu}
          />
        )}
      </ModalShell>
    ));

    activeModalIdRef.current = modalId;
    setActiveMenu(menu);
  };

  return (
    <nav
      ref={navRef}
      className={clsx("border-y border-border bg-card py-2", STYLE_PADDING)}
    >
      <div className="mx-auto flex w-full max-w-400 items-center gap-4">
        <div className="flex items-center gap-5 overflow-x-auto whitespace-nowrap text-sm font-medium text-muted-foreground">
          <NavMenuButton
            label="Browse"
            open={activeMenu === "browse"}
            onClick={() => openNavMenu("browse")}
          />
          <NavMenuButton
            label="Categories"
            open={activeMenu === "categories"}
            onClick={() => openNavMenu("categories")}
          />
        </div>

        <div className="ml-auto flex items-center gap-3 max-md:w-auto">
          <div
            className="w-120 max-w-[42vw] min-w-[18rem] max-lg:w-[24rem] max-md:hidden"
            onMouseDownCapture={() => {
              if (activeMenu) closeNavMenu();
            }}
          >
            <SearchInput
              value={query}
              placeholder="Search Game..."
              onChange={setQuery}
              className="w-full"
            />
          </div>

          <div
            className="shrink-0"
            onMouseDownCapture={() => {
              if (activeMenu) closeNavMenu();
            }}
          >
            <Dropdown
              options={options}
              placeholder={selectedChain?.name}
              placeholderImage={selectedChain?.icon_url}
              onChange={(option) => {
                setSelectedChain(option.value);
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="mx-auto mt-3 hidden w-full max-w-400 max-md:block"
        onMouseDownCapture={() => {
          if (activeMenu) closeNavMenu();
        }}
      >
        <SearchInput
          value={query}
          placeholder="Search Game..."
          onChange={setQuery}
          className="w-full"
        />
      </div>
    </nav>
  );
};

function NavMenuButton({
  label,
  open,
  onClick,
}: {
  label: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <ButtonWithSound
      onClick={onClick}
      className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
    >
      <span>{label}</span>
      <FontAwesomeIcon
        icon={faChevronDown}
        className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}
      />
    </ButtonWithSound>
  );
}

function BrowseMenu({
  categories,
  isLoading,
  onNavigate,
}: {
  categories: Category[];
  isLoading: boolean;
  onNavigate: () => void;
}) {
  const playClick = useClickSound("/sounds/click.mp3", 0.6);
  const listMenu = [
    {
      title: "Game Vault",
      href: "/",
    },
    {
      title: "My Library",
      href: "/my-games",
    },
    {
      title: "New Releases",
      href: "/#",
    },
    {
      title: "Top Games",
      href: "/#",
    },
    {
      title: "All Games",
      href: "/#",
    },
  ];
  return (
    <div className={clsx("max-h-[60dvh] overflow-y-auto", STYLE_PADDING)}>
      <div className="mx-auto grid w-full max-w-400 grid-cols-[16rem_1fr] max-lg:grid-cols-1">
        <div className="flex flex-col">
          {listMenu.map((item, i) => (
            <EmbedLink
              key={i}
              href={item.href}
              onClick={() => {
                playClick();
                onNavigate();
              }}
              className="border-b border-transparent px-3 py-4 transition-colors hover:border-border hover:bg-background/60"
            >
              {item.title}
            </EmbedLink>
          ))}
        </div>

        <div className="p-6">
          <CategoryGrid
            categories={categories.slice(0, 6)}
            isLoading={isLoading}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
}

function CategoriesMenu({
  categories,
  isLoading,
  onNavigate,
}: {
  categories: Category[];
  isLoading: boolean;
  onNavigate: () => void;
}) {
  return (
    <div className={clsx("max-h-[60dvh] overflow-y-auto", STYLE_PADDING)}>
      <div className="mx-auto w-full max-w-400 mt-4 mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="sr-only">Find your next genre</h3>
        </div>
        <CategoryGrid
          categories={categories}
          isLoading={isLoading}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}

function CategoryGrid({
  categories,
  isLoading,
  onNavigate,
}: {
  categories: Category[];
  isLoading: boolean;
  onNavigate: () => void;
}) {
  const playClick = useClickSound("/sounds/click.mp3", 0.6);
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl bg-muted/60"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
      {categories.map((category) => (
        <EmbedLink
          key={category.category_id}
          href="/#categories"
          onClick={() => {
            playClick();
            onNavigate();
          }}
          className="group relative flex min-h-24 overflow-hidden rounded-xl border border-border/60"
        >
          <img
            src={
              category.cover_image
                ? getAssetUrl(category.cover_image)
                : IMAGE_LOADING
            }
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
          <div className="relative flex items-end p-4">
            <span className="rounded-lg bg-card/85 px-3 py-1 text-sm font-medium">
              {category.name}
            </span>
          </div>
        </EmbedLink>
      ))}
    </div>
  );
}
