// Component Type Enums
const ComponentType = {
    ActionRow: 1,
    Button: 2,
    StringSelect: 3,
    TextInput: 4,
    UserSelect: 5,
    RoleSelect: 6,
    MentionableSelect: 7,
    ChannelSelect: 8,
    Section: 9,
    TextDisplay: 10,
    Thumbnail: 11,
    MediaGallery: 12,
    File: 13,
    Separator: 14,
    Container: 17
};

const ComponentOfLayoutType = {
    ActionRow: 1,
    Section: 9,
    Separator: 14,
    Container: 17
};

const ComponentOfInteractiveType = {
    Button: 2,
    StringSelect: 3,
    TextInput: 4,
    UserSelect: 5,
    RoleSelect: 6,
    MentionableSelect: 7,
    ChannelSelect: 8
};

const ComponentOfContentType = {
    TextDisplay: 10,
    Thumbnail: 11,
    MediaGallery: 12,
    File: 13
};

// Base Component Class
class Component {
    constructor(type) {
        this.type = type;
        this.id = undefined;
    }

    build() {
        return {};
    }
}

// Action Row Component
class ActionRow extends Component {
    constructor() {
        super(ComponentType.ActionRow);
        this.components = [];
    }

    addComponents(...components) {
        for (const component of components) {
            if (
                [ComponentType.RoleSelect, ComponentType.UserSelect, ComponentType.MentionableSelect, ComponentType.ChannelSelect].includes(component.type) &&
                component.type === ComponentType.Button
            ) {
                throw new Error("Only buttons or a single select component can be added to action row.");
            }

            if (this.components.find(a => a.type === ComponentType.TextInput) && component.type === ComponentType.TextInput) {
                throw new Error("Cannot add more than one text input component to action row.");
            }

            if ([ComponentType.RoleSelect, ComponentType.UserSelect, ComponentType.MentionableSelect, ComponentType.ChannelSelect].includes(component.type) &&
                this.components.find(a => [ComponentType.RoleSelect, ComponentType.UserSelect, ComponentType.MentionableSelect, ComponentType.ChannelSelect].includes(a.type))) {
                throw new Error("Cannot add more than one select component to action row.");
            }

            if (this.components.length >= 5) {
                throw new Error("Cannot add more than 5 components to action row.");
            }

            this.components.push(component);
        }
        return this;
    }

    build() {
        return {
            type: this.type,
            components: this.components.map(component => component.build())
        };
    }
}

// Button Styles
const ButtonStyle = {
    Primary: 1,
    Secondary: 2,
    Success: 3,
    Danger: 4,
    Link: 5
};

// Button Component
class Button extends Component {
    constructor() {
        super(ComponentType.Button);
        this.style = undefined;
        this.label = undefined;
        this.emoji = undefined;
        this.custom_id = undefined;
        this.sku_id = undefined;
        this.url = undefined;
        this.disabled = undefined;
    }

    setStyle(style) {
        this.style = style;
        return this;
    }

    setLabel(label) {
        this.label = label;
        return this;
    }

    setEmoji(emoji) {
        this.emoji = emoji;
        return this;
    }

    setCustomId(customId) {
        this.custom_id = customId;
        return this;
    }

    setSkuId(skuId) {
        this.sku_id = skuId;
        return this;
    }

    setUrl(url) {
        this.url = url;
        return this;
    }

    setDisabled(disabled) {
        this.disabled = disabled;
        return this;
    }

    build() {
        return {
            type: this.type,
            label: this.label,
            style: this.style,
            custom_id: this.custom_id,
            url: this.url,
            disabled: this.disabled
        };
    }
}

// Select Option Class
class SelectOption {
    constructor() {
        this.label = undefined;
        this.value = undefined;
        this.description = undefined;
        this.emoji = undefined;
        this.default = undefined;
    }

    setLabel(label) {
        this.label = label;
        return this;
    }

    setValue(value) {
        this.value = value;
        return this;
    }

    setDescription(description) {
        this.description = description;
        return this;
    }

    setEmoji(emoji) {
        this.emoji = emoji;
        return this;
    }

    setDefault(defaultValue) {
        this.default = defaultValue;
        return this;
    }

    build() {
        return {
            label: this.label,
            value: this.value,
            description: this.description,
            emoji: this.emoji,
            default: this.default
        };
    }
}

// String Select Component
class StringSelect extends Component {
    constructor() {
        super(ComponentType.StringSelect);
        this.custom_id = undefined;
        this.options = [];
        this.placeholder = undefined;
        this.min_values = undefined;
        this.max_values = undefined;
        this.disabled = undefined;
    }

    setCustomId(customId) {
        this.custom_id = customId;
        return this;
    }

    addOptions(...options) {
        for (const option of options) {
            if (this.options.length >= 25) {
                throw new Error("Cannot add more than 25 options to select component.");
            }
            this.options.push(option);
        }
        return this;
    }

    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }

    setMinValues(minValues) {
        this.min_values = minValues;
        return this;
    }

    setMaxValues(maxValues) {
        this.max_values = maxValues;
        return this;
    }

    setDisabled(disabled) {
        this.disabled = disabled;
        return this;
    }

    build() {
        return {
            type: this.type,
            custom_id: this.custom_id,
            options: this.options.map(option => option.build())
        };
    }
}

// Text Input Styles
const TextInputStyle = {
    Short: 1,
    Paragraph: 2
};

// Text Input Component
class TextInput extends Component {
    constructor() {
        super(ComponentType.TextInput);
        this.custom_id = undefined;
        this.style = undefined;
        this.label = undefined;
        this.min_length = undefined;
        this.max_length = undefined;
        this.required = undefined;
        this.value = undefined;
        this.placeholder = undefined;
    }

    setCustomId(customId) {
        this.custom_id = customId;
        return this;
    }

    setStyle(style) {
        this.style = style;
        return this;
    }

    setLabel(label) {
        this.label = label;
        return this;
    }

    setMinLength(minLength) {
        this.min_length = minLength;
        return this;
    }

    setMaxLength(maxLength) {
        this.max_length = maxLength;
        return this;
    }

    setRequired(required) {
        this.required = required;
        return this;
    }

    setValue(value) {
        this.value = value;
        return this;
    }

    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }

    build() {
        return {
            type: this.type,
            custom_id: this.custom_id,
            style: this.style,
            label: this.label,
            min_length: this.min_length,
            max_length: this.max_length,
            required: this.required,
            value: this.value,
            placeholder: this.placeholder
        };
    }
}

// Select Default Value Class
class SelectDefaultValue {
    constructor() {
        this.id = undefined;
        this.type = undefined; // "user" | "role" | "channel"
    }
}

// User Select Component
class UserSelect extends Component {
    constructor() {
        super(ComponentType.UserSelect);
        this.custom_id = undefined;
        this.placeholder = undefined;
        this.default_values = [];
        this.min_values = 1;
        this.max_values = 1;
        this.disabled = undefined;
    }

    setCustomId(customId) {
        this.custom_id = customId;
        return this;
    }

    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }

    setDefaultValues(...defaultValues) {
        for (const defaultValue of defaultValues) {
            if (!this.max_values && this.default_values.length >= 25) {
                throw new Error("Cannot add more than 25 default values to select component.");
            }
            if (this.max_values && this.default_values.length >= this.max_values) {
                throw new Error("Cannot add more than max values to select component.");
            }
            this.default_values.push(defaultValue);
        }
        return this;
    }

    setMinValues(minValues) {
        if (this.max_values && minValues > this.max_values) {
            throw new Error("Min values cannot be more than max values.");
        }
        if (minValues < 0) {
            throw new Error("Min values cannot be less than 0.");
        }
        if (minValues > 25) {
            throw new Error("Min values cannot be more than 25.");
        }
        this.min_values = minValues;
        return this;
    }

    setMaxValues(maxValues) {
        if (this.min_values && maxValues < this.min_values) {
            throw new Error("Max values cannot be less than min values.");
        }
        if (maxValues > 25) {
            throw new Error("Max values cannot be more than 25.");
        }
        this.max_values = maxValues;
        return this;
    }

    setDisabled(disabled) {
        this.disabled = disabled;
        return this;
    }

    build() {
        return {
            type: this.type,
            custom_id: this.custom_id,
            placeholder: this.placeholder,
            default_values: this.default_values.map(defaultValue => ({
                id: defaultValue.id,
                type: defaultValue.type
            })),
            min_values: this.min_values,
            max_values: this.max_values,
            disabled: this.disabled
        };
    }
}

// Role Select Component
class RoleSelect extends Component {
    constructor() {
        super(ComponentType.RoleSelect);
        this.custom_id = undefined;
        this.placeholder = undefined;
        this.default_values = [];
        this.min_values = 1;
        this.max_values = 1;
        this.disabled = undefined;
    }

    setCustomId(customId) {
        this.custom_id = customId;
        return this;
    }

    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }

    setDefaultValues(...defaultValues) {
        for (const defaultValue of defaultValues) {
            if (!this.max_values && this.default_values.length >= 25) {
                throw new Error("Cannot add more than 25 default values to select component.");
            }
            if (this.max_values && this.default_values.length >= this.max_values) {
                throw new Error("Cannot add more than max values to select component.");
            }
            this.default_values.push(defaultValue);
        }
        return this;
    }

    setMinValues(minValues) {
        if (this.max_values && minValues > this.max_values) {
            throw new Error("Min values cannot be more than max values.");
        }
        if (minValues < 0) {
            throw new Error("Min values cannot be less than 0.");
        }
        if (minValues > 25) {
            throw new Error("Min values cannot be more than 25.");
        }
        this.min_values = minValues;
        return this;
    }

    setMaxValues(maxValues) {
        if (this.min_values && maxValues < this.min_values) {
            throw new Error("Max values cannot be less than min values.");
        }
        if (maxValues > 25) {
            throw new Error("Max values cannot be more than 25.");
        }
        this.max_values = maxValues;
        return this;
    }

    setDisabled(disabled) {
        this.disabled = disabled;
        return this;
    }

    build() {
        return {
            type: this.type,
            custom_id: this.custom_id,
            placeholder: this.placeholder,
            default_values: this.default_values.map(defaultValue => ({
                id: defaultValue.id,
                type: defaultValue.type
            })),
            min_values: this.min_values,
            max_values: this.max_values,
            disabled: this.disabled
        };
    }
}

// Mentionable Select Component
class MentionableSelect extends Component {
    constructor() {
        super(ComponentType.MentionableSelect);
        this.custom_id = undefined;
        this.placeholder = undefined;
        this.default_values = [];
        this.min_values = 1;
        this.max_values = 1;
        this.disabled = undefined;
    }

    setCustomId(customId) {
        this.custom_id = customId;
        return this;
    }

    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }

    setDefaultValues(...defaultValues) {
        for (const defaultValue of defaultValues) {
            if (!this.max_values && this.default_values.length >= 25) {
                throw new Error("Cannot add more than 25 default values to select component.");
            }
            if (this.max_values && this.default_values.length >= this.max_values) {
                throw new Error("Cannot add more than max values to select component.");
            }
            this.default_values.push(defaultValue);
        }
        return this;
    }

    setMinValues(minValues) {
        if (this.max_values && minValues > this.max_values) {
            throw new Error("Min values cannot be more than max values.");
        }
        if (minValues < 0) {
            throw new Error("Min values cannot be less than 0.");
        }
        if (minValues > 25) {
            throw new Error("Min values cannot be more than 25.");
        }
        this.min_values = minValues;
        return this;
    }

    setMaxValues(maxValues) {
        if (this.min_values && maxValues < this.min_values) {
            throw new Error("Max values cannot be less than min values.");
        }
        if (maxValues > 25) {
            throw new Error("Max values cannot be more than 25.");
        }
        this.max_values = maxValues;
        return this;
    }

    setDisabled(disabled) {
        this.disabled = disabled;
        return this;
    }

    build() {
        return {
            type: this.type,
            custom_id: this.custom_id,
            placeholder: this.placeholder,
            default_values: this.default_values.map(defaultValue => ({
                id: defaultValue.id,
                type: defaultValue.type
            })),
            min_values: this.min_values,
            max_values: this.max_values,
            disabled: this.disabled
        };
    }
}

// Channel Select Component
class ChannelSelect extends Component {
    constructor() {
        super(ComponentType.ChannelSelect);
        this.custom_id = undefined;
        this.placeholder = '';
        this.channel_types = [];
        this.default_values = [];
        this.min_values = 1;
        this.max_values = 1;
        this.disabled = false;
    }

    setCustomId(customId) {
        this.custom_id = customId;
        return this;
    }

    setPlaceholder(placeholder) {
        if (placeholder.length > 100) {
            throw new Error("Placeholder cannot be more than 100 characters.");
        }
        this.placeholder = placeholder;
        return this;
    }

    setChannelTypes(...channelTypes) {
        this.channel_types = channelTypes;
        return this;
    }

    setDefaultValues(...defaultValues) {
        for (const defaultValue of defaultValues) {
            if (!this.max_values && this.default_values.length >= 25) {
                throw new Error("Cannot add more than 25 default values to select component.");
            }
            if (this.max_values && this.default_values.length >= this.max_values) {
                throw new Error("Cannot add more than max values to select component.");
            }
            this.default_values.push(defaultValue);
        }
        return this;
    }

    setMinValues(minValues) {
        if (this.max_values && minValues > this.max_values) {
            throw new Error("Min values cannot be more than max values.");
        }
        if (minValues < 0) {
            throw new Error("Min values cannot be less than 0.");
        }
        if (minValues > 25) {
            throw new Error("Min values cannot be more than 25.");
        }
        this.min_values = minValues;
        return this;
    }

    setMaxValues(maxValues) {
        if (this.min_values && maxValues < this.min_values) {
            throw new Error("Max values cannot be less than min values.");
        }
        if (maxValues > 25) {
            throw new Error("Max values cannot be more than 25.");
        }
        this.max_values = maxValues;
        return this;
    }

    setDisabled(disabled) {
        this.disabled = disabled;
        return this;
    }

    build() {
        return {
            type: this.type,
            custom_id: this.custom_id,
            placeholder: this.placeholder,
            channel_types: this.channel_types,
            default_values: this.default_values.map(defaultValue => ({
                id: defaultValue.id,
                type: defaultValue.type
            })),
            min_values: this.min_values,
            max_values: this.max_values,
            disabled: this.disabled
        };
    }
}

// Section Component
class Section extends Component {
    constructor() {
        super(ComponentType.Section);
        this.components = [];
        this.accessory = undefined;
    }

    addComponents(...components) {
        for (const component of components) {
            if (component.type !== ComponentType.TextDisplay) {
                throw new Error("Section can only contain text display components.");
            }
            if (this.components.length >= 3) {
                throw new Error("Cannot add more than 3 components to section.");
            }
            this.components.push(component);
        }
        return this;
    }

    setAccessory(component) {
        if (component.type !== ComponentType.Thumbnail && component.type !== ComponentType.Button) {
            throw new Error("Accessory can only be a button or a thumbnail.");
        }
        this.accessory = component;
        return this;
    }

    build() {
        if (!this.accessory) {
            throw new Error("Accessory is required for section.");
        }
        console.log({
            type: this.type,
            components: this.components.map(component => component.build()),
            accessory: this.accessory.build()
        });
        return {
            type: this.type,
            components: this.components.map(component => component.build()),
            accessory: this.accessory.build()
        };
    }
}

// Text Display Component
class TextDisplay extends Component {
    constructor() {
        super(ComponentType.TextDisplay);
        this.content = undefined;
    }

    setContent(content) {
        this.content = content;
        return this;
    }

    build() {
        return {
            type: this.type,
            content: this.content
        };
    }
}

// Thumbnail Component
class Thumbnail extends Component {
    constructor() {
        super(ComponentType.Thumbnail);
        this.media = undefined;
        this.description = undefined;
        this.spoiler = undefined;
    }

    setMedia(media) {
        this.media = media;
        return this;
    }

    setDescription(description) {
        this.description = description;
        return this;
    }

    setSpoiler(spoiler) {
        this.spoiler = spoiler;
        return this;
    }

    build() {
        if (!this.media) {
            throw new Error("Media is required for thumbnail.");
        }
        return {
            type: this.type,
            media: this.media,
            description: this.description,
            spoiler: this.spoiler
        };
    }
}

// Media Gallery Item Class
class MediaGalleryItem {
    constructor() {
        this.media = undefined;
        this.description = undefined;
        this.spoiler = undefined;
    }

    setURL(url) {
        if (!this.media) {
            this.media = {
                url
            };
        } else {
            this.media.url = url;
        }
        return this;
    }

    setDescription(description) {
        this.description = description;
        return this;
    }

    setSpoiler(spoiler) {
        this.spoiler = spoiler;
        return this;
    }

    build() {
        if (!this.media) {
            throw new Error("Media is required for media gallery item.");
        }
        return {
            media: this.media,
            description: this.description,
            spoiler: this.spoiler
        };
    }
}

// Media Gallery Component
class MediaGallery extends Component {
    constructor() {
        super(ComponentType.MediaGallery);
        this.items = [];
    }

    addItems(...items) {
        for (const item of items) {
            if (this.items.length >= 10) {
                throw new Error("Cannot add more than 10 items to media gallery.");
            }
            this.items.push(item);
        }
        return this;
    }

    build() {
        return {
            type: this.type,
            items: this.items.map(item => item.build())
        };
    }
}

// File Component
class File extends Component {
    constructor() {
        super(ComponentType.File);
        this.file = null;
        this.spoiler = false;
    }

    setFile(file) {
        this.file = file;
        return this;
    }

    setSpoiler(spoiler) {
        this.spoiler = spoiler;
        return this;
    }

    build() {
        if (!this.file) {
            throw new Error("File is required for file component.");
        }
        if (!this.file.url.startsWith('attachment://')) {
            throw new Error("File url must match the syntax attachment://<filename>");
        }
        return {
            type: this.type,
            file: this.file,
            spoiler: this.spoiler
        };
    }
}

// Separator Component
class Separator extends Component {
    constructor() {
        super(ComponentType.Separator);
        this.divider = true;
        this.spacing = 1;
    }

    setDivider(divider) {
        this.divider = divider;
        return this;
    }

    setSpacing(spacing) {
        if (spacing < 1 || spacing > 2) {
            throw new Error("Spacing must be between 1 and 2.");
        }
        this.spacing = spacing;
        return this;
    }

    build() {
        return {
            type: this.type,
            divider: this.divider,
            spacing: this.spacing
        };
    }
}

// Container Component
class Container extends Component {
    constructor() {
        super(ComponentType.Container);
        this.components = [];
        this.accent_color = undefined;
        this.spoiler = false;
    }

    addComponents(...components) {
        for (const component of components) {
            if (![ComponentType.ActionRow, ComponentType.TextDisplay, ComponentType.Section, ComponentType.MediaGallery, ComponentType.Separator, ComponentType.File].includes(component.type)) {
                throw new Error("Container can only contain action rows, text display, section, media gallery, separator or file components.");
            }
            this.components.push(component);
        }
        return this;
    }

    setAccentColor(color) {
        this.accent_color = color;
        return this;
    }

    setSpoiler(spoiler) {
        this.spoiler = spoiler;
        return this;
    }

    build() {
        return {
            type: this.type,
            components: this.components.map(component => component.build()),
            accent_color: this.accent_color,
            spoiler: this.spoiler
        };
    }
}

// Export everything for use
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        ComponentType,
        ComponentOfLayoutType,
        ComponentOfInteractiveType,
        ComponentOfContentType,
        Component,
        ActionRow,
        ButtonStyle,
        Button,
        SelectOption,
        StringSelect,
        TextInputStyle,
        TextInput,
        SelectDefaultValue,
        UserSelect,
        RoleSelect,
        MentionableSelect,
        ChannelSelect,
        Section,
        TextDisplay,
        Thumbnail,
        MediaGalleryItem,
        MediaGallery,
        File,
        Separator,
        Container
    };
} else {
    window.DiscordComponents = {
        ComponentType,
        ComponentOfLayoutType,
        ComponentOfInteractiveType,
        ComponentOfContentType,
        Component,
        ActionRow,
        ButtonStyle,
        Button,
        SelectOption,
        StringSelect,
        TextInputStyle,
        TextInput,
        SelectDefaultValue,
        UserSelect,
        RoleSelect,
        MentionableSelect,
        ChannelSelect,
        Section,
        TextDisplay,
        Thumbnail,
        MediaGalleryItem,
        MediaGallery,
        File,
        Separator,
        Container
    };
}