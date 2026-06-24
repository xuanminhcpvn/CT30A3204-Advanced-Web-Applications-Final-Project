import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchSortTool from "../components/SearchSortTool";
import PaginationTool from "../components/PaginationTool";
import { useTranslation } from "react-i18next";

interface IDriveFile {
    _id: string;
    ownerId: string;
    filename: string;
    type: "text" | "spreadsheet" | "slide" | "image";
    createdAt: string;
    updatedAt: string;
    isPublic: boolean;
    isSoftDeleted: boolean;
    softDeletedAt: string;
    shareLink: string;
}

interface IUser {
    _id: string;
    username: string;
    email: string;
}

const Trash = () => {
    const [jwt, setJwt] = useState<string | null>(null);
    const [files, setFiles] = useState<IDriveFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);

    const [sortBy, setSortBy] = useState<string>("updatedAt");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    const { t } = useTranslation();  
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setJwt(token);
    }, []);

    useEffect(() => {
        if (!jwt) return;
        fetchFiles();
        fetchMe();
    }, [jwt]);

    // GET files
    const fetchFiles = async () => {
        setLoading(true);

        try {
            const res = await fetch("/api/files/trash", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`,
                },
            });

            if (!res.ok) throw new Error("Fetch failed");

            const data: IDriveFile[] = await res.json();
            setFiles(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMe = async () => {
        try {
            const res = await fetch("/api/user/me", {
                headers: { Authorization: `Bearer ${jwt}` },
            });

            if (!res.ok) throw new Error("User fetch failed");

            setUser(await res.json());
        } catch (err) {
            console.log(err);
        }
    };


    //TRASH-only action (for refactoring later)
    //Restore files
    const restoreFile = async (id: string) => {
        try {
            const res = await fetch(`/api/files/${id}/restore`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                },
            });

            if (!res.ok) throw new Error("Restore failed");

            fetchFiles();
        } catch (err) {
            console.log(err);
        }
    };
    //permanent
    const permanentDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/files/${id}/permanent-delete`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            if (!res.ok) throw new Error("Delete failed");

            fetchFiles();
        } catch (err) {
            console.log(err);
        }
    };
    //similar like in home but Trash => sort => search => paginate
    const trashedFiles = files.filter((file) => file.isSoftDeleted);

    const sortedFiles = [...trashedFiles].sort((a, b) => {
        if (sortBy === "filename") {
            return a.filename.localeCompare(b.filename);
        }

        if (sortBy === "createdAt") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    const searchedFiles = sortedFiles.filter((f) =>
        f.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * itemsPerPage;

    const paginatedFiles = searchedFiles.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const totalPages = Math.ceil(searchedFiles.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortBy]);

    //COULD REFACTOR THIS LATER 
    const formatDate = (dateInput: string) => {
        const date: Date = new Date(dateInput);
        const day:string = String(date.getDate()).padStart(2, "0");
        const month:string = String(date.getMonth() + 1).padStart(2, "0");
        const year:string = String(date.getFullYear());
        return `${day}.${month}.${year}`;
    };

    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
            <h2>{t("Own Trash Bin")}</h2>
            <button onClick={() => navigate("/")}>{t("Back to Home")}</button>
            {!jwt ? (
                <p>{t("Please login to fetch the files.")}</p>
            ) : (
                <>
                    {/* search and sort at same level */}
                    <SearchSortTool searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortBy={sortBy}setSortBy={setSortBy}/>
                    {loading && <p>{t("Loading...")}</p>}
                    {/* FILE LIST */}
                    {paginatedFiles.map((file) => {
                        const isOwner = user?._id === file.ownerId;
                        return (
                            <div key={file._id}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "15px",
                                    marginBottom: "10px",
                                    borderRadius: "8px",
                                }}>
                                <strong>{file.filename}</strong>
                                <div>{t("Deleted at: ")} {formatDate(file.softDeletedAt)}</div>
                                <div style={{ marginTop: "10px" }}>
                                    {/* ONLY ALLOWED ACTIONS */}
                                    {isOwner && (
                                    <>
                                        <button style={{ marginRight: "10px" }} onClick={() =>restoreFile(file._id)}>{t("Restore file")}</button>
                                        <button style={{ marginRight: "10px", color: "red"}} onClick={() =>permanentDelete(file._id)}>{t("Delete file forever")}</button></>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <PaginationTool currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
                    {files.length === 0 && !loading && <p>{t("No file in trash")}</p>}
                </>
            )}
        </div>
    );
};

export default Trash;