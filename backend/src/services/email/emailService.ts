import { ContributionData } from "../../types/contribution";
import { sendEmail } from "../../utils/sendEmail";

export class EmailService {
  constructor() {
    // Simple email service using utility function
  }

  async sendContributionEmail(
    contributionData: ContributionData
  ): Promise<boolean> {
    try {
      const emailContent = this.formatContributionData(contributionData);
      const adminEmail =
        process.env.ADMIN_EMAIL ||
        process.env.EMAIL_USER ||
        "hungnbc2@gmail.com";

      await sendEmail(
        [adminEmail],
        `[Chèo Ontology] Đóng góp mới: ${contributionData.playData.playName}`,
        emailContent
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const testEmail = process.env.EMAIL_USER || "hungnbc2@gmail.com";
      await sendEmail(
        [testEmail],
        "Test Email Connection",
        "Email service connection test successful!"
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  private formatContributionData(data: ContributionData): string {
    const { playData, characterData, actorData, contributorInfo } = data;

    let content = "🎭 ĐÓNG GÓP THÔNG TIN CHÈO MỚI\n";
    content += "=".repeat(50) + "\n\n";

    // Contributor info
    if (
      contributorInfo &&
      (contributorInfo.name || contributorInfo.email || contributorInfo.note)
    ) {
      content += "👤 THÔNG TIN NGƯỜI ĐÓNG GÓP:\n";
      if (contributorInfo.name) content += `Tên: ${contributorInfo.name}\n`;
      if (contributorInfo.email) content += `Email: ${contributorInfo.email}\n`;
      if (contributorInfo.note) content += `Ghi chú: ${contributorInfo.note}\n`;
      content += "\n";
    }

    // Play info
    content += "📚 THÔNG TIN VỞ DIỄN:\n";
    content += `Tên vở: ${playData.playName}\n`;
    content += `Tác giả: ${playData.author}\n`;
    content += `Số cảnh: ${playData.sceneCount}\n`;
    content += `Tóm tắt: ${playData.summary}\n\n`;

    // Scenes
    content += "🎬 CHI TIẾT CÁC CẢNH:\n";
    playData.scenes.forEach((scene, index) => {
      content += `\nCảnh ${index + 1}: ${scene.name}\n`;
      content += `- Tóm tắt: ${scene.summary}\n`;
      content += `- Số video: ${scene.videoCount}\n`;
      const validLinks = scene.videoLinks.filter((link) => link.trim());
      if (validLinks.length > 0) {
        content += `- Video links:\n`;
        validLinks.forEach((link) => (content += `  + ${link}\n`));
      }
    });

    // Characters
    content += "\n🎭 THÔNG TIN NHÂN VẬT:\n";
    characterData.characters.forEach((character, index) => {
      content += `\nNhân vật ${index + 1}: ${character.name}\n`;
      content += `- Loại: ${character.type}\n`;
      content += `- Giới tính: ${character.gender}\n`;
      content += `- Mô tả: ${character.description}\n`;
    });

    // Actors
    content += "\n🎪 THÔNG TIN DIỄN VIÊN:\n";
    actorData.actors.forEach((actor, index) => {
      content += `\nDiễn viên ${index + 1}: ${actor.name}\n`;
      content += `- Nhân vật thủ vai: ${actor.character}\n`;
      content += `- Mô tả: ${actor.description}\n`;
    });

    content += "\n" + "=".repeat(50) + "\n";
    content += `Thời gian: ${new Date().toLocaleString("vi-VN")}\n`;
    content += "Email được gửi tự động từ hệ thống Chèo Ontology\n";

    return content;
  }
}
