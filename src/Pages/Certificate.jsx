import React, { useRef } from "react";
import html2canvas from "html2canvas";
import "./Certificate.css";
import { getAuth } from "firebase/auth";

const Certificate = ({ score, total, quizTitle }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const certRef = useRef();

  // Generate certificate ID
  const certificateId = `CERT-${quizTitle?.replace(
    /\s+/g,
    "-"
  )}-${user?.uid?.slice(-6)}`;

  const downloadCertificate = async () => {
    const element = certRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = data;
    link.download = `${user.displayName}_Certificate.png`;
    link.click();
  };

  return (
    <div className="certificate-wrapper">
      <div className="certificate-container" ref={certRef}>
        <div className="certificate">
          <h2><u>Certificate</u></h2>
          <p>This certificate is proudly presented to</p>
          <h3>{user.displayName}</h3>
          <p>
            for successfully completing the quiz <strong>{quizTitle}</strong>{" "}
            with a score of{" "}
            <strong>
              {score} / {total}
            </strong>
            .
          </p>
          <p className="cert-id">
            Certificate ID: <strong>{certificateId}</strong>
          </p>
          <p className="footer">Issued by Quiz App</p>
        </div>
      </div>

      <button onClick={downloadCertificate} className="download-btn">
        <span role="img" aria-label="certificate">
          📄
        </span>
        Download Certificate
      </button>
    </div>
  );
};

export default Certificate;
