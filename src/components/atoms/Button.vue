<template>
    <button
        :type="type"
        :disabled="disabled || loading"
        :aria-busy="loading ? 'true' : 'false'"
        :aria-disabled="disabled ? 'true' : 'false'"
        :class="[
            'base-button',
            buttonClasses
        ]"
        @click="handleClick"
    >
        <span v-if="loading" class="loader"></span>
        <slot v-else></slot>
    </button>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';

const props = defineProps( {
    type: {
        type: String as PropType< 'button' | 'submit' >,
        default: 'button'
    },
    size: {
        type: String as PropType< 'small' | 'regular' | 'large' >,
        default: 'regular'
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    variant: {
        type: String,
        default: 'primary'
    },
    block: {
        type: Boolean
    }
} );

const emits = defineEmits( [ 'click' ] );

const buttonClasses = computed( () => {
    return [
        `base-button--size-${props.size}`,
        { 'base-button--variant-primary': props.variant === 'primary' },
        { 'base-button--block': props.block },
        { 'base-button--disabled': props.disabled || props.loading }
    ]
} );

const handleClick = ( event: Event ) => {
    if ( props.disabled || props.loading ) {
        event.preventDefault();
      } else {
        emits( 'click', event );
      }
};

</script>

<style lang="scss">
.base-button {
    border: none;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: background 0.3s ease;
    font-family: 'Montserrat', serif;
    font-weight: 500;
    box-shadow: 0 3px 6px 0 rgba(0,0,0,.14);

    &--variant {
        &-primary {
            background: linear-gradient(45deg, #28a745, #218838);
            &:hover { background: linear-gradient(45deg, #218838, #1e7e34); }
        }
    }

    &--block {
        width: 100%;
    }

    &--size {
        &-small {
            font-size: 1rem;
            padding: 0.5rem 1rem;
        }   
        &-regular {
            font-size: 1rem;
            padding: 1rem 2rem;
        }
        &-large {
            padding: 1.3rem 2rem;
            font-size: x-large;
        }
    }

    &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.loader {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid white;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

</style>