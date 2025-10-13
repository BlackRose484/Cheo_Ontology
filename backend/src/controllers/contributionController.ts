import { Request, Response } from "express";
import { ContributionData, ContributionResponse } from "../types/contribution";
import { EmailService } from "../services/email/emailService";
import { randomUUID } from "crypto";

export class ContributionController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async submitContribution(req: Request, res: Response): Promise<void> {
    try {
      const contributionData: ContributionData = req.body;

      // Validate contribution data
      const validationResult = this.validateContributionData(contributionData);
      if (!validationResult.isValid) {
        res.status(400).json({
          success: false,
          message: `Dữ liệu không hợp lệ: ${validationResult.errors.join(
            ", "
          )}`,
        });
        return;
      }

      const submissionId = randomUUID();

      const emailSent = await this.emailService.sendContributionEmail(
        contributionData
      );

      if (emailSent) {
        res.status(200).json({
          success: true,
          message:
            "Cảm ơn bạn đã đóng góp! Thông tin của bạn đã được gửi đến ban quản lý để xem xét.",
          submissionId,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống. Vui lòng thử lại sau.",
      });
    }
  }

  async testEmailConnection(req: Request, res: Response): Promise<void> {
    try {
      const isConnected = await this.emailService.testConnection();

      res.status(isConnected ? 200 : 500).json({
        success: isConnected,
        message: isConnected
          ? "Email service connection successful"
          : "Email service connection failed",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error testing email connection",
      });
    }
  }

  private validateContributionData(data: ContributionData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.playData) {
      errors.push("Thiếu thông tin vở diễn");
    } else {
      if (!data.playData.playName?.trim()) {
        errors.push("Tên vở diễn không được để trống");
      }
      if (!data.playData.author?.trim()) {
        errors.push("Tên tác giả không được để trống");
      }
      if (!data.playData.summary?.trim()) {
        errors.push("Tóm tắt vở diễn không được để trống");
      }
      if (!data.playData.scenes || data.playData.scenes.length === 0) {
        errors.push("Cần có ít nhất một cảnh diễn");
      } else {
        data.playData.scenes.forEach((scene, index) => {
          if (!scene.name?.trim()) {
            errors.push(`Tên cảnh ${index + 1} không được để trống`);
          }
          if (!scene.summary?.trim()) {
            errors.push(`Tóm tắt cảnh ${index + 1} không được để trống`);
          }
        });
      }
    }

    // Validate character data
    if (
      !data.characterData ||
      !data.characterData.characters ||
      data.characterData.characters.length === 0
    ) {
      errors.push("Cần có ít nhất một nhân vật");
    } else {
      data.characterData.characters.forEach((character, index) => {
        if (!character.name?.trim()) {
          errors.push(`Tên nhân vật ${index + 1} không được để trống`);
        }
        if (!character.type?.trim()) {
          errors.push(`Loại nhân vật ${index + 1} không được để trống`);
        }
        if (!character.gender?.trim()) {
          errors.push(`Giới tính nhân vật ${index + 1} không được để trống`);
        }
      });
    }

    // Validate actor data
    if (
      !data.actorData ||
      !data.actorData.actors ||
      data.actorData.actors.length === 0
    ) {
      errors.push("Cần có ít nhất một diễn viên");
    } else {
      data.actorData.actors.forEach((actor, index) => {
        if (!actor.name?.trim()) {
          errors.push(`Tên diễn viên ${index + 1} không được để trống`);
        }
        if (!actor.character?.trim()) {
          errors.push(
            `Nhân vật thủ vai của diễn viên ${index + 1} không được để trống`
          );
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const contributionController = new ContributionController();
