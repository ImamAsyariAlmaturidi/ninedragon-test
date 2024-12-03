"use server";
import { NextResponse, NextRequest } from "next/server";
import db from "../../../../database/models";
import { z } from "zod";

const authorSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const pageSize = 10;

  try {
    const { count, rows: authors } = await db.Author.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    if (authors.length === 0) {
      return NextResponse.json({
        message: "No authors found",
        status: 404,
      });
    }

    const totalPages = Math.ceil(count / pageSize);

    return NextResponse.json({
      data: authors,
      totalPages,
      currentPage: page,
      message: "Authors fetched successfully",
      status: 200,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching authors",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseAuthorData = authorSchema.safeParse(body);

    if (!parseAuthorData.success) {
      return NextResponse.json({
        message: "Invalid input for creating an author",
        errors: parseAuthorData.error.errors,
        status: 400,
      });
    }

    const author = await db.Author.create(parseAuthorData.data);

    return NextResponse.json({
      message: "Success creating an author",
      data: author,
      status: 201,
    });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while creating an author",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({
        message: "ID is required to delete an author",
        status: 400,
      });
    }

    const deleted = await db.Author.destroy({ where: { id } });

    if (deleted) {
      return NextResponse.json({
        message: "Success deleting author",
        status: 200,
      });
    }

    return NextResponse.json({
      message: "Author not found",
      status: 404,
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while deleting an author",
      },
      { status: 500 }
    );
  }
}
