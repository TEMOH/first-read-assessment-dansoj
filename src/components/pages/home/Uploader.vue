<template>
    <div class="home-page-uploader">
        <AtomButton class="home-page-uploader__button" @click="triggerFileInput">
            Select XML file
        </AtomButton>
        <input
            ref="fileInput"
            type="file" accept=".xml"
            @change="handleFileUpload"
            class="home-page-uploader__input" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import AtomButton from '@/components/atoms/Button.vue';

const emits = defineEmits( [ 'uploaded:file'] );

const fileInput = ref<HTMLInputElement>( )

const triggerFileInput = () => {
    fileInput.value?.click();
};

const handleFileUpload = ( e: Event ) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;


    emits( 'uploaded:file', file )
}

const resetFileUpload = () => {
    ( fileInput.value as HTMLInputElement ).value = ''
}

defineExpose ( { resetFileUpload } )

</script>

<style lang="scss">
.home-page-uploader {
    &__button {
        min-width: 250px;
        margin-bottom: 10px;
    }
    &__input {
        display: none;
    }
}
</style>