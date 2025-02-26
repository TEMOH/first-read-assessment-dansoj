<template>
    <div ref="contentDiv" class="home-page-content">
        <div  v-if="content" class="home-page-content__header">
            <AtomIconDocument />
            <h3 class="home-page-content__header__title">{{ title }}</h3>
            <div class="home-page-content__header__actions">
                <button @click="toggleTheme">
                    <AtomIconSunShine v-if="isDarkMode" />
                    <AtomIconMoonLight v-else />
                </button>
                <button @click="toggleFullscreen">
                    <AtomIconExpand />
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
                <AtomIconDocument />
                <p>Uploaded file will be displayed here</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AtomIconDocument from '@/components/atoms/icon/Document.vue';
import AtomIconExpand from '@/components/atoms/icon/Expand.vue';
import AtomIconSunShine from '@/components/atoms/icon/SunShine.vue';
import AtomIconMoonLight from '@/components/atoms/icon/MoonLight.vue';

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

const contentDiv = ref<HTMLDivElement | null>(null);
const isDarkMode = ref<boolean>(false);

const toggleFullscreen = () => {
    const contentDivElement = contentDiv.value;
    if ( document.fullscreenElement ) {
        document.exitFullscreen();
    } else {
        if (contentDivElement?.requestFullscreen) {
            contentDivElement.requestFullscreen();
        } else if ( ( contentDivElement as any )?.mozRequestFullScreen ) { // Firefox
            ( contentDivElement as any ).mozRequestFullScreen();
        } else if ( ( contentDivElement as any ).webkitRequestFullscreen ) { // Chrome, Safari and Opera
            ( contentDivElement as any ).webkitRequestFullscreen();
        } else if ( ( contentDivElement as any ).msRequestFullscreen ) { // IE/Edge
            ( contentDivElement as any ).msRequestFullscreen();
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
        .word-image {
            max-width: 100%;
            height: auto;
            margin: 10px 0;
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