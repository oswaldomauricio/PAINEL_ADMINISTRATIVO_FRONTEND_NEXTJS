"use client"

import { useState } from "react"
import { Bold, Italic, List, ListOrdered, Underline } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)

  const insertText = (before: string, after = "") => {
    const textarea = document.getElementById(
      "description"
    ) as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end)

    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const formatText = (format: string) => {
    switch (format) {
      case "bold":
        insertText("**", "**")
        break
      case "italic":
        insertText("*", "*")
        break
      case "underline":
        insertText("<u>", "</u>")
        break
      case "list":
        insertText("\n- ", "")
        break
      case "orderedList":
        insertText("\n1. ", "")
        break
    }
  }

  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
      .replace(/\n- (.*)/g, "<li>$1</li>")
      .replace(/\n\d+\. (.*)/g, "<li>$1</li>")
      .replace(/\n/g, "<br>")
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-2 border rounded-t-lg bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("bold")}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("italic")}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("underline")}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("list")}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("orderedList")}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {isPreview ? (
        <div
          className="min-h-[200px] p-3 border border-t-0 rounded-b-lg bg-white prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
        />
      ) : (
        <Textarea
          id="description"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter detailed description of the warranty issue..."
          className="min-h-[200px] border-t-0 rounded-t-none focus:ring-0 focus:border-gray-300"
        />
      )}
    </div>
  )
}
