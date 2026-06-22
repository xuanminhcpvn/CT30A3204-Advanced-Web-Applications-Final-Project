import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//import ReactQuill from 'react-quill-new';

interface IDriveFile {
    _id: string;
    filename: string;
    contents: string;
}
const DocumentEdit = () => {
    const [content, setContent] = useState('');
    const {driveFileId} = useParams<{ driveFileId: string }>();
    const [document, setDocument] = useState<IDriveFile | null>(null);

    const [jwt, setJwt] = useState<string | null>(null)
    useEffect(() => {
        if(localStorage.getItem("token")) {
            setJwt(localStorage.getItem("token"))
        }
    }, [jwt])

    useEffect(() => {
        const fetchDocument = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/document/${driveFileId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                window.location.href = "/"; 
                throw new Error("Error while fetching file");
            }
            const data = await res.json();
            setDocument(data.file);
        };

        if (driveFileId) {
            fetchDocument();
        }
    }, [driveFileId]);

    const saveDocument = async () => {
        const token = localStorage.getItem("token");

        await fetch(`/api/document/${driveFileId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                contents: document?.contents,
            }),
        });
    };

    return (
        <div>
            <h2>{document?.filename}</h2>
            <textarea value={document?.contents || ""} onChange={(e) =>
                setDocument(prev =>
                    prev ? { ...prev, contents: e.target.value } : prev
                )
            }
            />
            <button onClick={saveDocument}>Save</button>
        </div>
    );
};

export default DocumentEdit;