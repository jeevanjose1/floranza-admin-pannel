import React from "react";
import AsyncSelect, { type AsyncProps } from "react-select/async";
import type { StylesConfig, GroupBase } from "react-select";

export type OptionType = {
  label: string;
  value: string;
};

type AsyncSelectCustomProps = AsyncProps<
  OptionType,
  boolean,
  GroupBase<OptionType>
>;

export default function AsyncSelectCustom(props: AsyncSelectCustomProps) {
  return (
    <AsyncSelect
      classNames={{
        control: (state) =>
          `!min-h-8 !rounded-sm ${
            state.isFocused ? "!border-ring !ring-1 !ring-ring" : ""
          }`,
        valueContainer: (state) => `p-0  ${(state.hasValue && state.isMulti) ? '!px-1':''} min-h-8 rounded-xl !text-sm`,
        placeholder: () => "text-[13px]",
        input: (state) => `m-0 p-0 `,
        indicatorsContainer: () => "h-8 rounded-xl",
        menu: () => " !rounded-md p-1.5",
        option: (state) =>
          ` ${state.isFocused ? "!bg-muted/30 text-black" : ""} ${
            state.isSelected ? "!bg-muted/50 !text-black" : ""
          } !text-sm rounded-sm `,
        menuList: () => "!py-0",
        multiValue:()=>'!rounded-sm'
      }}
      {...props}
    />
  );
}
