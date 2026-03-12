'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import CreateMemoryForm from './CreateMemoryForm'
import styles from './AddMemoryButton.module.css'

interface AddMemoryButtonProps {
    variant?: 'navbar' | 'fab' | 'inline'
}

export default function AddMemoryButton({ variant = 'navbar' }: AddMemoryButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleSuccess = () => {
        // Trigger a page refresh to show new memory
        window.location.reload()
    }

    const getButtonClass = () => {
        switch (variant) {
            case 'fab':
                return styles.fabBtn
            case 'inline':
                return styles.inlineBtn
            default:
                return styles.navbarBtn
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={getButtonClass()}
            >
                <Plus />
                {variant !== 'fab' && <span>Add Memory</span>}
            </button>

            <CreateMemoryForm
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSuccess={handleSuccess}
            />
        </>
    )
}