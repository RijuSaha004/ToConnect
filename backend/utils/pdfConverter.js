import PDFDocument from "pdfkit";
import crypto from "node:crypto";
import fs from "fs";
import axios from "axios"

export const convertUserDataToPDF = ({userProfile, allWorks, allEducations}) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("public/" + outputPath);

    doc.pipe(stream);

    if (userProfile.profilePicture !== "default.png") {
      const imageRes = await axios.get(userProfile.profilePicture, {
        responseType: "arraybuffer",
      });
      doc.image(imageRes.data, { align: "center", width: 100 });
    }else{
      doc.image(`public/${userProfile.profilePicture}`, { align: "center", width: 100 });
    }

    doc.fontSize(14).text(`Name: ${userProfile.name}`);
    doc.fontSize(14).text(`Username: ${userProfile.username}`);
    doc.fontSize(14).text(`Email: ${userProfile.email}`);
    doc.fontSize(14).text(`Bio: ${userProfile.bio || ""}`);
    doc.fontSize(14).text(`Current Position: ${userProfile.currentPost || ""}`);

    doc.fontSize(14).text("Past Work:");

    (allWorks || []).forEach((work) => {
      doc.fontSize(14).text(`Company: ${work.company || ""}`);
      doc.fontSize(14).text(`Position: ${work.position || ""}`);
      doc.fontSize(14).text(`Years: ${work.years || ""}`);
    });

    doc.fontSize(14).text("Education:");

    (allEducations || []).forEach((edc) => {
      doc.fontSize(14).text(`Company: ${edc.school || ""}`);
      doc.fontSize(14).text(`Position: ${edc.degree || ""}`);
      doc.fontSize(14).text(`Years: ${edc.fieldOfStudy || ""}`);
    });

    doc.end();

    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
};
