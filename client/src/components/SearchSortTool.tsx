// components/SearchSortTool.tsx

import { useTranslation } from "react-i18next";

interface Props {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
}
const SearchSortTool = ({
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy
}: Props) => {
    const { t } = useTranslation();
    return (
        <div style={{display: "flex",flexWrap: "wrap", gap: "10px", alignItems: "center"}}>
            <input style={{flex: 1, minWidth: "180px" }} type="text" placeholder={t("Search documents...")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            <label>{t("Sort By")}: </label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">{t("By Name")}</option>
                <option value="createdAt">{t("By Created Date")}</option>
                <option value="updatedAt">{t("Last Updated Date")}</option>
            </select>
        </div>
    );
};

export default SearchSortTool;