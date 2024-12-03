"use server";
import db from "../../../../database/models"; // Make sure the path is correct
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

const authorSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const bookSchemaWithoutId = z.object({
  title: z.string(),
  serial_number: z.string(),
  published_at: z.date(),
  author_id: z.number(),
});

const bookSchemaWithId = bookSchemaWithoutId.extend({
  id: z.number(),
});

const bookWithId = z.object({
  id: z.number(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "6");

    if (isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1) {
      return NextResponse.json(
        {
          message: "Invalid page or pageSize parameter",
        },
        { status: 400 }
      );
    }

    const offset = (page - 1) * pageSize;

    const { count, rows: books } = await db.Book.findAndCountAll({
      include: db.Author,
      offset,
      limit: pageSize,
    });

    if (books.length === 0) {
      return NextResponse.json({ message: "No books found" }, { status: 404 });
    }

    const totalPages = Math.ceil(count / pageSize);

    return NextResponse.json({
      data: books,
      currentPage: page,
      totalPages,
      message: "Success Get All Books",
      status: 200,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching books",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.selectedAuthor) {
      return NextResponse.json({
        message: "Author id is required",
        status: 400,
      });
    }

    const newDataBook = {
      title: body?.title,
      serial_number: body?.serialNumber,
      published_at: new Date(),
      author_id: Number(body?.selectedAuthor),
    };

    const parsedBookData = bookSchemaWithoutId.safeParse(newDataBook);

    if (!parsedBookData.success) {
      return NextResponse.json(
        {
          message: "Invalid book data",
          errors: parsedBookData.error.errors,
        },
        { status: 400 }
      );
    }

    const createBook = await db.Book.create(parsedBookData.data);

    return NextResponse.json({
      data: createBook,
      message: "Success Create A Book",
      status: 201,
    });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while creating book",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    const parsedBookData = bookWithId.safeParse(body);

    if (!parsedBookData.success) {
      return NextResponse.json(
        {
          message: "Invalid book data",
          errors: parsedBookData.error.errors,
        },
        { status: 400 }
      );
    }

    const { id } = parsedBookData.data;

    const book = await db.Book.findByPk(id);

    if (!book) {
      return NextResponse.json(
        {
          message: "Book not found",
        },
        { status: 404 }
      );
    }

    await book.destroy();

    return NextResponse.json({
      data: book,
      message: "Success Delete A Book",
      status: 200,
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while deleting book",
      },
      { status: 500 }
    );
  }
}
