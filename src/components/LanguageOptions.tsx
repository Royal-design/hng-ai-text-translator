import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { setSelectedLang } from "@/redux/slice/chatSlice";
import { HiOutlineLanguage } from "react-icons/hi2";
import { langToCountry, languages } from "@/assets/data/Languages";
import { getCountryName } from "@/features/getCountryName";

export const LanguageOptions = () => {
  const dispatch = useAppDispatch();
  const { selectedLang, detectedLang } = useAppSelector((state) => state.chat);
  const handleSwapLanguages = () => {
    if (detectedLang !== selectedLang) {
      dispatch(setSelectedLang(detectedLang));
    }
  };
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex items-center border rounded-md p-1 px-2 gap-2">
        <img
          src={
            languages.find((lang) => lang.code === detectedLang)?.flag ||
            `https://flagcdn.com/w40/${
              detectedLang?.toLowerCase() in langToCountry
                ? langToCountry[detectedLang.toLowerCase()]
                : detectedLang?.toLowerCase() || { detectedLang }
            }.png`
          }
          alt="Detected Flag"
          className="w-6 h-6 rounded-full"
        />

        <span className="text-sm font-semibold">
          {languages.find((lang) => lang.code === detectedLang)?.name ||
            getCountryName(detectedLang)}
        </span>
      </div>

      <button onClick={handleSwapLanguages} className="text-2xl">
        <HiOutlineLanguage />
      </button>

      <div className="flex items-center gap-2">
        <Select
          value={selectedLang}
          onValueChange={(value) => dispatch(setSelectedLang(value))}
        >
          <SelectTrigger className="w-40 border rounded-lg p-2">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem
                disabled={lang.code === detectedLang}
                key={lang.code}
                value={lang.code}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    className="w-6 h-6 rounded-full"
                  />
                  {lang.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
