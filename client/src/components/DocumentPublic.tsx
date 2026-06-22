import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface IDriveFile {
    _id: string;
    filename: string;
    contents: string;
}

const DocumentPublic = () => {
    const { driveFileId } = useParams<{ driveFileId: string }>();

    const [document, setDocument] = useState<IDriveFile| null>(null);

    useEffect(() => {
        const fetchDocument = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(`/api/document/${driveFileId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setDocument(data.file);
        };

        if (driveFileId) {
            fetchDocument();
        }
    }, [driveFileId]);

    return (
        <div>
            <h2>{document?.filename}</h2>
            <p>{document?.contents}</p>
        </div>
    );
};

export default DocumentPublic;