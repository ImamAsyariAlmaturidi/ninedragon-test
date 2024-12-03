"use server";
import { z } from "zod";
import db from "../../../../../database/models";
import { NextRequest, NextResponse } from "next/server";

const authorSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  id: z.number(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      {
        message: "ID is required",
      },
      {
        status: 400,
      }
    );
  }

  const numericId = Number(id);

  if (isNaN(numericId)) {
    return NextResponse.json(
      {
        message: "Invalid ID format",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const author = await db.Author.findByPk(numericId);

    if (!author) {
      return NextResponse.json({
        message: `Author with ID ${numericId} not found`,
        status: 404,
      });
    }

    return NextResponse.json({
      message: `Successfully retrieved author with ID ${numericId}`,
      data: author,
      status: 200,
    });
  } catch (error) {
    console.error("GET Author Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while retrieving the author",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;
    const { name, email } = body;

    if (!id) {
      return NextResponse.json({
        message: "ID is required to update an author",
        status: 400,
      });
    }

    const parseAuthorData = authorSchema.safeParse({
      name,
      email,
      id: Number(id),
    });

    if (!parseAuthorData.success) {
      return NextResponse.json({
        message: "Invalid input for updating an author",
        errors: parseAuthorData.error.errors,
        status: 400,
      });
    }

    const [updated] = await db.Author.update(parseAuthorData.data, {
      where: { id },
    });

    if (updated) {
      const updatedAuthor = await db.Author.findByPk(id);
      return NextResponse.json({
        message: "Successfully updated author",
        data: updatedAuthor,
        status: 200,
      });
    }

    return NextResponse.json({
      message: "Author not found",
      status: 404,
    });
  } catch (error) {
    console.error("PUT Author Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while updating the author",
      },
      { status: 500 }
    );
  }
}
