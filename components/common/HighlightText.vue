<script setup lang="ts">
const props = defineProps<{
  matchText?: string;
  text: string;
}>();

function getRegexFromText (text: string): RegExp {
  const ignoreAccentText = text
    .replaceAll('(', '\\(')
    .replaceAll('ă', '(?:[ăắằặẳ])')
    .replaceAll('â', '(?:[âấầậẩẫ])')
    .replaceAll('a', '(?:[aàáạảãăắằặẳâấầậẩẫ])')
    .replaceAll('ơ', '(?:[ơớờởợỡ])')
    .replaceAll('ô', '(?:[ôộồốổỗ])')
    .replaceAll('o', '(?:[oòóọỏõơớờởợỡôộồốổỗ])')
    .replaceAll('ê', '(?:[êếềệễể])')
    .replaceAll('e', '(?:[eèéẻẽẹêếềệễể])')
    .replaceAll('ư', '(?:[ưựữửừứ])')
    .replaceAll('u', '(?:[uùúụũủưựữửừứ])')
    .replaceAll('i', '(?:[iíìịỉĩ])')
    .replaceAll('d', '(?:[dđ])');
  return new RegExp(`(${ignoreAccentText})`, 'ig');
}
</script>

<template>
  <p v-if="matchText">
    <span
      v-for="(fragment, index) in props.text.split(getRegexFromText(matchText!))"
      :key="index">
      <span :class="index % 2 ? 'text-tertiary-dark' : ''">{{ fragment }}</span>
    </span>
  </p>
  <p v-else>
    {{ text }}
  </p>
</template>
