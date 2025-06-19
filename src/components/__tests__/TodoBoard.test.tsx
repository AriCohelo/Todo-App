import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { TodoBoard } from "../TodoBoard"

describe('TodoBoard', () => {
    it('should render', () => {
        render(<TodoBoard />)
        expect(screen.getByText('Todo Board')).toBeInTheDocument()
    })
})