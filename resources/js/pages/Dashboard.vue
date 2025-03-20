<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import PlaceholderPattern from '@/components/PlaceholderPattern.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];
</script>

<template>

    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <!-- <div class="bg-surface-50 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20"> -->
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-lg">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span
                                    class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Orders</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium !text-xl">152</div>
                            </div>
                            <div
                                class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/30 rounded-lg w-10 h-10">
                                <i class="pi pi-shopping-cart text-blue-500 dark:text-blue-200 !text-xl" />
                            </div>
                        </div>
                        <span class="text-green-500 font-medium">24 new </span>
                        <span class="text-surface-500 dark:text-surface-300">since last visit</span>
                    </div>
                </div>
                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-lg">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span
                                    class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Revenue</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium !text-xl">$2.100</div>
                            </div>
                            <div
                                class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/30 rounded-lg w-10 h-10">
                                <i class="pi pi-map-marker text-orange-500 dark:text-orange-200 !text-xl" />
                            </div>
                        </div>
                        <span class="text-green-500 font-medium">%52+ </span>
                        <span class="text-surface-500 dark:text-surface-300">since last week</span>
                    </div>
                </div>
                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-lg">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span
                                    class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Customers</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium !text-xl">28441</div>
                            </div>
                            <div
                                class="w-10 h-10 flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/30 rounded-lg">
                                <i class="pi pi-inbox text-cyan-500 dark:text-cyan-200 !text-xl" />
                            </div>
                        </div>
                        <span class="text-green-500 font-medium">520 </span>
                        <span class="text-surface-500 dark:text-surface-300">newly registered</span>
                    </div>
                </div>
                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded-lg">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span
                                    class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Comments</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium !text-xl">152 Unread
                                </div>
                            </div>
                            <div
                                class="w-10 h-10 flex items-center justify-center bg-purple-100 dark:bg-purple-400/30 rounded-lg">
                                <i class="pi pi-comment text-purple-500 dark:text-purple-200 !text-xl" />
                            </div>
                        </div>
                        <span class="text-green-500 font-medium">85 </span>
                        <span class="text-surface-500 dark:text-surface-300">responded</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- <div class="grid auto-rows-min gap-4 md:grid-cols-3">
                <div
                    class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern />
                </div>
                <div
                    class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern />
                </div>
                <div
                    class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern />
                </div>
            </div> -->
        <!-- <div
                class="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border md:min-h-min">
                <PlaceholderPattern />
            </div> -->
        <!-- </div> -->
    </AppLayout>
</template>
