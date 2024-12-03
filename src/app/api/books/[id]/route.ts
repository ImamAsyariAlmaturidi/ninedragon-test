"use server";
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../database/models";
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const dataForUpdate = {
      id: Number(params.id),
      title: body?.title,
      serial_number: body?.serial_number,
      published_at: body?.published_at
        ? new Date(body.published_at)
        : new Date(),
      author_id: body?.author_id,
    };

    const parsedBookData = bookSchemaWithId.safeParse(dataForUpdate);

    if (!parsedBookData.success) {
      return NextResponse.json(
        {
          message: "Invalid book data",
          errors: parsedBookData.error.errors,
        },
        { status: 400 }
      );
    }

    const { id, author_id } = parsedBookData.data;

    const book = await db.Book.findByPk(id);

    if (!book) {
      return NextResponse.json(
        {
          message: "Book not found",
        },
        { status: 404 }
      );
    }

    const authorExists = await db.Author.findByPk(author_id);
    if (!authorExists) {
      return NextResponse.json(
        {
          message: "Author not found",
        },
        { status: 404 }
      );
    }

    await book.update(parsedBookData.data);

    return NextResponse.json({
      data: book,
      message: "Success Update A Book",
      status: 200,
    });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while updating the book",
      },
      { status: 500 }
    );
  }
}
