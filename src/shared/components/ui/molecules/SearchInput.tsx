"use client";

import { ChangeEvent } from "react";
import { STYLE_HOVER } from "@/shared/constants/style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { PriceCoin } from "./CoinWithAmmount";
import { useModal } from "@/core/ui-system/modal/modal.store";
import ModalShell from "@/core/ui-system/modal/ModalShell";

interface SearchInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({
  value,
  placeholder = "Search...",
  onChange,
  className,
}: SearchInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const openResultModal = () =>
    useModal.getState().open((id) => (
      <ModalShell id={id}>
        <Modal />
      </ModalShell>
    ));

  return (
    <div
      className={`
        flex items-center gap-2
        rounded-xl border border-border
        px-3 py-2
        w-full
        relative
        bg-transparent
        hover:cursor-text 
        ${STYLE_HOVER}
        ${className ?? ""}
      `}
      // onClick={openResultModal}
    >
      {/* Search Icon */}
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="text-muted-foreground"
      />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="
           w-full bg-transparent h-6
          outline-none
          placeholder:text-muted-foreground
        "
      />

      {/* <Modal /> */}
    </div>
  );

  function Modal() {
    return (
      <div className="z-10 absolute top-full mt-2 right-0 bg-card rounded-2xl border p-4 flex flex-col gap-2 w-full">
        <h2>Top Result</h2>
        <div className="flex flex-col">
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    );
  }

  function Card() {
    return (
      <div className="flex p-2 h-20 items-center gap-4 hover:bg-border rounded-lg cursor-pointer">
        <div className="bg-accent aspect-video rounded-lg h-full"></div>
        <div className="flex flex-col gap-1">
          <h3 className="font-medium line-clamp-1">
            Fortnite stiamnsdkm asdlk msadasd asdasd{" "}
          </h3>
          <PriceCoin amount={300000} textSize="sm" />
        </div>
      </div>
    );
  }
}
