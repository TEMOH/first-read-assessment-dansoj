<template>
    <div class="home-page">
        <div class="home-page__form">
            <PageHomeHeader />
            <PageHomeUploader
                @uploaded:file="setUploadedFile"
            />
        </div>
        <PageHomeContent
            class="home-page__content"
            :title="documentTitle"
            :content="formattedFile"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import PageHomeHeader from '@/components/pages/home/Header.vue';
import PageHomeUploader from '@/components/pages/home/Uploader.vue'
import PageHomeContent from '@/components/pages/home/Content.vue'
import { useParser } from '@/composables/useParser'

const { formattedFile, parseXML } = useParser( )

const documentTitle = ref< string >( '' )

const setUploadedFile = ( file: File ) => {
    documentTitle.value = file.name;

    const reader = new FileReader();
    reader.onload = ( e ) => {
        if( !e.target?.result ) {
            return
        }
        const parser = new DOMParser();
        const xmlDocument = parser.parseFromString( e.target.result as string, 'text/xml' );
        parseXML( xmlDocument )
    }
    reader.readAsText( file )
};

</script>

<style lang="scss">
.home-page {
    display: grid;
    grid-template-columns: 1fr 2fr;
    height: 100vh;
    grid-template-rows: 100%;

    &__form {
        padding: 100px 50px 50px;
        text-align: center;
    }

    &__content {
        overflow-x: hidden;
    }

    @media (max-width: 1024px) {
        display: flex;
        flex-direction: column;
        height: auto;

        .home-page__content {
            position: sticky;
            top: 0;
            z-index: 10;
            height: calc( 100vh - 30px );
        }
    }
}
</style>