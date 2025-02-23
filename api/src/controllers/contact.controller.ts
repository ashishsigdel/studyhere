import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { getImageURL } from "../utils/FileUpload";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import User from "../models/user";

interface CustomRequest extends Request {
  user?: InstanceType<typeof User>;
}

export const reportbug = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { title, description } = req.body;

    if (!title || !description) {
      throw new ApiError({
        status: 400,
        message: "Please fill required field!",
      });
    }

    let publicUrl;
    if (req.file) {
      try {
        publicUrl = await getImageURL({
          buffer: req.file.buffer,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
        });
      } catch (error) {
        throw new ApiError({
          status: 500,
          message: "Error uploading file to cloud.",
        });
      }
    }
    const user = req.user;

    try {
      const response = await fetch(
        "https://api.ashishsigdel.com.np/api/v1/contact",
        {
          method: "POST", // Assuming POST request
          headers: {
            "Content-Type": "application/json", // Ensure the content type is JSON
          },
          body: JSON.stringify({
            email: user?.email,
            fullName: user?.fullName,
            company: "StudyHere",
            message: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
              <h2 style="color: #5f6368; border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 20px;">Bug Report</h2>
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                <strong>Title:</strong> ${title}
              </p>
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                <strong>Description:</strong> ${description}
              </p>
              ${
                publicUrl
                  ? `<img src="${publicUrl}" alt="Bug Image" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-top: 20px;" />`
                  : ""
              }
             
            </div>
          `,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send report.");
      }
    } catch (error) {
      throw new ApiError({
        status: 400,
        message: "Can't report! Try again later.",
      });
    }

    return new ApiResponse({
      status: 200,
      message: "Message sent.",
    }).send(res);
  }
);
