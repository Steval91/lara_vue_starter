<script setup lang="ts">
import { defineProps, ref, computed, watch } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/vue3';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';
import Toolbar from 'primevue/toolbar';
import IconField from 'primevue/iconfield';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();
const toast = useToast();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengguna',
        href: '/users',
    },
];

const props = defineProps({
    users: {
        type: Object,
        required: true,
    },
    perPage: {
        type: Number,
        default: 10,
    },
    totalRecords: {
        type: Number,
        default: 0,
    },
});

const search = ref('')
const sortField = ref('created_at');
const sortOrder = ref(-1);
const perPage = ref(Number(props.users.per_page) || 10);
const currentPage = ref(props.users.current_page);
const totalRecords = ref(props.users.total);

const filteredUsers = computed(() => props.users.data);

const onRowsChange = (value: number) => {
    perPage.value = value;
    currentPage.value = 1;

    router.get("/users", {
        search: search.value,
        sortField: sortField.value,
        sortOrder: sortOrder.value,
        perPage: perPage.value,
        page: currentPage.value,
    }, {
        preserveState: true, replace: true, onSuccess: (response) => {
            totalRecords.value = response.props.totalRecords;
        }
    });
};

watch([search, sortField, sortOrder, perPage, currentPage],
    ([newSearch, newSortField, newSortOrder, newPerPage, newCurrentPage],
        [oldSearch, oldSortField, oldSortOrder, oldPerPage]) => {

        if (newSearch !== oldSearch || newSortField !== oldSortField || newSortOrder !== oldSortOrder || newPerPage !== oldPerPage) {
            currentPage.value = 1;
        }

        router.get("/users", {
            search: newSearch,
            sortField: newSortField,
            sortOrder: newSortOrder,
            perPage: newPerPage,
            page: newCurrentPage,
        }, {
            preserveState: true,
            replace: true,
            onSuccess: (response) => {
                totalRecords.value = response.props.totalRecords;
            }
        });
    }
);

const onPageChange = (e: any) => {
    currentPage.value = e.page + 1;
};

type User = {
    id: number | null;
    name: string;
    email: string;
    role: string;
};
const form = useForm<User>({
    id: null,
    name: '',
    email: '',
    role: '',
});
const errors = computed(() => form.errors);

const roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
];

const getRoleSeverity = (role: string) => {
    if (role === 'admin') {
        return 'success';
    } else if (role === 'user') {
        return 'info';
    }
}
const showDialog = ref(false);
const isEditMode = ref(false);

const openAddDialog = () => {
    isEditMode.value = false;
    form.reset();
    showDialog.value = true;
};

const openEditDialog = (user: User) => {
    isEditMode.value = true;
    form.id = user.id;
    form.email = user.email;
    form.name = user.name;
    form.role = user.role;
    showDialog.value = true;
};

const closeDialog = () => {
    showDialog.value = false;
    form.reset();
    form.errors = {};
};

const saveUser = () => {
    if (isEditMode.value) {
        form.put(`/users/${form.id}`, {
            onSuccess: () => {
                closeDialog();
                toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Data pengguna telah diperbarui.', life: 3000 });
            },
            onError: (err) => {
                console.error("Error updating user:", err);
            }
        });
    } else {
        form.post('/users', {
            onSuccess: () => {
                closeDialog();
                toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Data pengguna telah disimpan.', life: 3000 });
            },
            onError: (err) => {
                console.error("Error saving user:", err);
            }
        });
    }
}

const confirmDelete = (data: User) => {
    confirm.require({
        message: `Apakah Anda ingin menghapus data pengguna ${data.name}?`,
        header: 'Konfirmasi Hapus',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Tidak',
            severity: 'primary',
            outlined: true
        },
        acceptProps: {
            label: 'Ya',
            severity: 'danger',

        },
        accept: () => {
            deleteUser(data);
        },
        reject: () => {
        }
    });
};

const deleteUser = (data: User) => {
    router.delete(`/users/${data.id}`, {
        onSuccess: () => {
            toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Data pengguna telah dihapus', life: 3000 });
        },
        onError: (err) => {
            console.error("Error deleting user:", err);
        }
    });
}

const selectedUsers = ref<User[]>([]);

const confirmBulkDelete = () => {
    confirm.require({
        message: `Apakah Anda ingin menghapus data pengguna yang dipilih?`,
        header: 'Konfirmasi Hapus',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Tidak',
            severity: 'primary',
            outlined: true
        },
        acceptProps: {
            label: 'Ya',
            severity: 'danger',
        },
        accept: () => {
            bulkDeleteUsers();
        },
        reject: () => {
        }
    });
}

const bulkDeleteUsers = () => {
    const ids = selectedUsers.value.map(user => user.id);
    router.visit('/users/bulk-delete', {
        method: 'post',
        data: { ids },
        onSuccess: () => {
            toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Pengguna berhasil dihapus.', life: 3000 });
            selectedUsers.value = [];
        },
        onError: (err) => {
            console.error("Error bulk deleting users:", err);
        }
    });
};
</script>

<template>

    <Head title="Pengguna" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <Toast />
        <ConfirmDialog size="small" />
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <Toolbar class="mb-2">
                <template #start>
                    <Button label="Tambah" icon="pi pi-plus" class="mr-2" @click="openAddDialog" size="small" />
                    <Button label="Hapus" icon="pi pi-trash" class="p-button-danger"
                        :disabled="selectedUsers.length === 0" @click="confirmBulkDelete" size="small" />
                </template>
                <template #end>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="search" placeholder="Cari pengguna" size="small" />
                    </IconField>
                </template>
            </Toolbar>

            <DataTable data-key="id" lazy paginator :value="filteredUsers" v-model:rows="perPage"
                @update:rows="onRowsChange" :rowsPerPageOptions="[10, 20, 50]" :totalRecords="totalRecords"
                removableSort v-model:sortField="sortField" v-model:sortOrder="sortOrder" @page="onPageChange"
                v-model:selection="selectedUsers" class="p-datatable-sm" scrollable scrollHeight="480px">
                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                <Column field="name" header="Nama" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="role" header="Peran" sortable>
                    <template #body="slotProps">
                        <Tag :severity="getRoleSeverity(slotProps.data.role)">{{ slotProps.data.role }}</Tag>
                    </template>
                </Column>
                <Column style="text-align: right;">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-contrast p-button-text"
                            @click="openEditDialog(slotProps.data)" size="small" />
                        <Button @click="confirmDelete(slotProps.data)" icon="pi pi-trash"
                            class="p-button-danger p-button-text" />
                    </template>
                </Column>
            </DataTable>

            <Dialog modal v-model:visible="showDialog" @hide="closeDialog"
                :header="isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna'" :style="{ width: '30vw' }"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                <div class="grid grid-cols-1 gap-4">
                    <div class="field">
                        <label for="name">Nama</label>
                        <InputText id="name" v-model="form.name" class="w-full" :class="{ 'p-invalid': errors.name }"
                            size="small" />
                        <small class="p-error" v-if="errors.name">{{ errors.name }}</small>
                    </div>
                    <div class="field">
                        <label for="email">Email</label>
                        <InputText id="email" v-model="form.email" class="w-full" :class="{ 'p-invalid': errors.email }"
                            size="small" />
                        <small class="p-error" v-if="errors.email">{{ errors.email }}</small>
                    </div>
                    <div class="field">
                        <label for="role">Peran</label>
                        <Select fluid checkmark v-model="form.role" :options="roleOptions" optionLabel="label"
                            optionValue="value" :highlightOnSelect="false" placeholder="Pilih Peran"
                            class="w-full md:w-56" :class="{ 'p-invalid': errors.role }" size="small" />
                        <small class="p-error" v-if="errors.role">{{ errors.role }}</small>
                    </div>
                </div>
                <template #footer>
                    <Button label="Batal" class="p-button-outlined" @click="closeDialog" size="small" />
                    <Button label="Simpan" :loading="form.processing" @click="saveUser" size="small" />
                </template>
            </Dialog>
        </div>
    </AppLayout>
</template>
