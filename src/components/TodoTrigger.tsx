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
        <div data-testid="todo-trigger" className="flex flex-col items-center  bg-zinc-700">
            <input 
                placeholder="take a note..." 
                className="mb-4 p-3 border border-stone-300 rounded-lg focus:ring-2 outline-none text-stone-300"
                onClick={handleOpenModal}
            />
           
            
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