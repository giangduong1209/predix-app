import React from "react";
import Input from "../ui/Input";

interface IFilterLeaderboardProps {
  onQueries?: (option: string) => void;
}

const FilterLeaderboard: React.FC<IFilterLeaderboardProps> = ({
  onQueries,
}) => {
  const changeOptionHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = e;

    if (onQueries) onQueries(value);
  };

  return (
    <div className="text-[--colors-textSubtle] py-6">
      <p className="mb-2">Rank by</p>
      <div className="flex flex-col-reverse gap-2 lg:flex-row lg:justify-between">
        <select
          className="select select-bordered bg-[--colors-input] w-full lg:max-w-[168px] rounded-2xl"
          onChange={changeOptionHandler}
          defaultValue="Round Played"
        >
          <option className="block py-4 px-2">Rounds Played</option>
          <option className="block py-4 px-2">Net Winnings</option>
          <option className="block py-4 px-2">Total BNB</option>
          <option className="block py-4 px-2">Win Rate</option>
        </select>
        {/* <Input
          className="w-full px-4 md:w-80 rounded-2xl focus:ring-2 focus:ring-[--colors-secondary]"
          placeholder="Search address"
        /> */}
      </div>
    </div>
  );
};

export default FilterLeaderboard;
