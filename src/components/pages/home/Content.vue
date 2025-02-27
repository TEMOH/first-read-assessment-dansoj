<template>
    <div ref="contentDiv" class="home-page-content">
        <div  v-if="content" class="home-page-content__header">
            <DocumentIcon />
            <h3 class="home-page-content__header__title">{{ title }}</h3>
            <div class="home-page-content__header__actions">
                <button @click="toggleTheme">
                    <SunShineIcon v-if="isDarkMode" />
                    <MoonLightIcon v-else />
                </button>
                <button
                    @click="toggleFullscreen"
                >
                    <ExpandIcon />
                </button>
                <button title="Close Document" @click="clearContent">
                    <CancelIcon style="color: red;" />
                </button>
            </div>
        </div>
        <div :class="[
                'home-page-content__main',
                { 'home-page-content__main--dark-mode': isDarkMode}
            ]"
        >
            <div v-if="content" v-html="content" />
            <div v-else class="home-page-content__main__empty">
                <DocumentIcon />
                <p>Uploaded file will be displayed here</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import DocumentIcon from '@/assets/icons/Document.vue';
import ExpandIcon from '@/assets/icons/Expand.vue';
import SunShineIcon from '@/assets/icons/SunShine.vue';
import MoonLightIcon from '@/assets/icons/MoonLight.vue';
import CancelIcon from '@/assets/icons/Cancel.vue';

interface FullscreenElement extends HTMLElement {
    mozRequestFullScreen?: () => Promise<void>; // Firefox
    webkitRequestFullscreen?: () => Promise<void>; // Chrome, Safari, Opera
    msRequestFullscreen?: () => Promise<void>; // IE/Edge
}

defineProps( {
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
} );

const emits = defineEmits( ['clearContent' ] )

const contentDiv = ref<FullscreenElement | null>(null);
const isDarkMode = ref<boolean>(false);

const toggleFullscreen = () => {
    const contentDivElement = contentDiv.value;

    if ( document.fullscreenElement ) {
        // Exit fullscreen if already in fullscreen mode
        document.exitFullscreen();
    } else if ( contentDivElement ) {
        // Request fullscreen for the contentDivElement
        if ( contentDivElement.requestFullscreen ) {
            contentDivElement.requestFullscreen();
        } else if ( contentDivElement.mozRequestFullScreen ) {
            contentDivElement.mozRequestFullScreen();
        } else if ( contentDivElement.webkitRequestFullscreen ) {
            contentDivElement.webkitRequestFullscreen();
        } else if ( contentDivElement.msRequestFullscreen ) {
            contentDivElement.msRequestFullscreen();
        }
    }
};

const handleEscKey = ( event: KeyboardEvent ) => {
    if ( event.key === 'Escape' && document.fullscreenElement ) {
        document.exitFullscreen();
    }
};

const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
};

const clearContent = () => {
    if( document.fullscreenElement ) {
        toggleFullscreen()
    }
    isDarkMode.value = false;
    emits( 'clearContent' )
}

onMounted( () => {
    window.addEventListener( 'keydown', handleEscKey );
} );

onBeforeUnmount( () => {
    window.removeEventListener( 'keydown', handleEscKey );
} );

</script>

<style lang="scss">
:root {
    --bg-light: #ffffff;
    --bg-dark: #1e1e1e;
    --text-light: #000000;
    --text-dark: #ffffff;
    --border-light: #e0e0e0;
    --border-dark: #444444;
}

.home-page-content {
    background: rgb(243 244 246 / 1);
    padding: 16px;
    display: flex;
    flex-direction: column;
    &__header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        &__title {
            margin-left: 10px;
        }

        &__actions {
            margin-left: auto;

            button {
                margin: 0px 10px;
            }
        }
    }

    &__main {
        padding: 16px;
        background: var(--bg-light);
        color: var(--text-light);
        border: 1px solid var(--border-light);
        transition: background 0.3s, color 0.3s, border 0.3s;
        border-radius: 10px;
        flex-grow: 1;
        overflow-x: hidden;
        overflow-y: auto; 

        &--dark-mode {
            background: var(--bg-dark);
            color: var(--text-dark);
            border: 1px solid var(--border-dark);

            table th, table td {
                border: 1px solid var(--border-dark);
            }
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            border: 1px solid var(--border-light);
        }
        th, td {
            padding: 8px;
            border: 1px solid var(--border-light);
            text-align: left;
        }
        h1, h2, h3, h4, h5, h6 {
            font-weight: bold;
            margin-top: 1em;
        }
        li {
            margin-left: 20px;
        }
        
        p {
            margin-bottom: 10px;
        }

        &__empty {
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            flex-direction: column;
            font-size: 14px;
            font-weight: 600;
            svg {
                width: 80px;
                height: 80px;
                opacity: 0.1;
                margin-bottom: 20px;
            }
        }
    }
}
</style>