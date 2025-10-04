import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BotMessageSquare, Settings, Sprout, Users, User2 } from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function AppSidebar() {
    const t = useTranslations('sidebar')
    const path = usePathname()
    
    const items = [
        {
            title: t('navigation.cropAnalysis'),
            url: "/crop-analysis/upload",
            icon: Sprout,
        },
        {
            title: t('navigation.chatbotAssistant'),
            url: "/chatbot",
            icon: BotMessageSquare,
        },
        {
            title: t('navigation.community'),
            url: "/community",
            icon: Users,
        },
        {
            title: t('navigation.expert'),
            url: "/contact-to-expert",
            icon: User2,
        },
        {
            title: t('navigation.setting'),
            url: "#",
            icon: Settings,
        },
    ]

    return (
        <Sidebar>
            <SidebarHeader>
                <div className='p-4'>
                    <Image 
                        src={'/logo.png'} 
                        alt={t('logo.alt')} 
                        width={100} 
                        height={100}
                        className='w-full h-full' 
                    />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className='mt-5'>
                            {items.map((item, index) => (
                                <a 
                                    href={item.url} 
                                    key={index} 
                                    className={`p-2 text-lg flex gap-2 items-center hover:bg-gray-100 rounded-lg ${path.includes(item.url) && 'bg-gray-200'}`}
                                >
                                    <item.icon className='h-5 w-5' />
                                    <span>{item.title}</span>
                                </a>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}