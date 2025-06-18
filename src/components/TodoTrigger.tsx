import { useState, useEffect } from 'react'

export const TodoTrigger = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCloseModal()
            }
        }

        if (isModalOpen) {
            document.addEventListener('keydown', handleEscKey)
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey)
        }
    }, [isModalOpen])

    return (
        <div data-testid="todo-trigger" className="flex flex-col items-center  min-h-screen bg-indigo-50">
            <input 
                placeholder="title" 
                className="mb-4 p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-indigo-900"
                onClick={handleOpenModal}
            />
            <ul>
                <li>
                    <input 
                        placeholder="add task" 
                        className="p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-indigo-900"
                        onClick={handleOpenModal}
                    />
                </li>
            </ul>
            
            {isModalOpen && (
                <div 
                    data-testid="todo-modal" 
                    className="fixed inset-0 bg-indigo-900/30 flex items-center justify-center"
                    onClick={handleCloseModal}
                >
                    <div 
                        className="bg-white p-6 rounded-lg shadow-lg border border-indigo-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Modal Content
                    </div>
                </div>
            )}
        </div>
    )
}