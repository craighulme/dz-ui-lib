/*
    QuackDuck Swing Utils for DeadZone.dev
*/

const JFrame = Java.type("javax.swing.JFrame");
const JPanel = Java.type("javax.swing.JPanel");
const JLabel = Java.type("javax.swing.JLabel");
const JButton = Java.type("javax.swing.JButton");
const JCheckBox = Java.type("javax.swing.JCheckBox");
const JComboBox = Java.type("javax.swing.JComboBox");
const JScrollPane = Java.type("javax.swing.JScrollPane");
const JTextArea = Java.type("javax.swing.JTextArea");
const JSeparator = Java.type("javax.swing.JSeparator");
const JProgressBar = Java.type("javax.swing.JProgressBar");
const BorderLayout = Java.type("java.awt.BorderLayout");
const FlowLayout = Java.type("java.awt.FlowLayout");
const GridLayout = Java.type("java.awt.GridLayout");
const GridBagLayout = Java.type("java.awt.GridBagLayout");
const GridBagConstraints = Java.type("java.awt.GridBagConstraints");
const Color = Java.type("java.awt.Color");
const Font = Java.type("java.awt.Font");
const BorderFactory = Java.type("javax.swing.BorderFactory");
const SwingConstants = Java.type("javax.swing.SwingConstants");
const Dimension = Java.type("java.awt.Dimension");
const PointJ = Java.type("java.awt.Point");
const Timer = Java.type("javax.swing.Timer");
const ActionListener = Java.type("java.awt.event.ActionListener");
const MouseAdapter = Java.type("java.awt.event.MouseAdapter");
const SwingUtilities = Java.type("javax.swing.SwingUtilities");
const EmptyBorder = Java.type("javax.swing.border.EmptyBorder");
const TitledBorder = Java.type("javax.swing.border.TitledBorder");
const MouseEvent = Java.type("java.awt.event.MouseEvent");
const KeyEvent = Java.type("java.awt.event.KeyEvent");
const KeyAdapter = Java.type("java.awt.event.KeyAdapter");


class SwingUtils {
    /**
     * @typedef {Object} Window
     * @property {string} id - Unique identifier for the window.
     * @property {JFrame} frame - The JFrame instance of the window.
     * @property {JPanel} mainPanel - The main panel of the window.
     * @property {JPanel} headerPanel - The header panel of the window.
     * @property {JPanel} contentPanel - The content panel of the window.
     * @property {JLabel} titleLabel - The label showing the title of the window.
     * @property {Object} colorScheme - The color scheme used for the window.
     * @property {Object} panels - Collection of panels created in the window.
     * @property {Object} components - Collection of components created in the window.
     * @property {Array<Timer>} timers - List of timers associated with the window.
     * @property {Function} show - Method to show the window.
     * @property {Function} hide - Method to hide the window.
     * @property {Function} toggle - Method to toggle the visibility of the window.
     * @property {Function} dispose - Method to dispose of the window.
     * @property {Function} setTitle - Method to set the window title.
     * @property {Function} createPanel - Method to create a panel in the window's content area.
     * @property {Function} createLabel - Method to create a label in a panel.
     * @property {Function} createButton - Method to create a button in a panel.
     * @property {Function} createCheckbox - Method to create a checkbox in a panel.
     * @property {Function} createComboBox - Method to create a dropdown (combo box) in a panel.
     * @property {Function} createProgressBar - Method to create a progress bar in a panel.
     * @property {Function} createTextArea - Method to create a text area in a panel.
     * @property {Function} createSeparator - Method to create a separator in a panel.
     * @property {Function} updateComponent - Method to update a component's text or value.
     * @property {Function} updatePanelTitle - Method to update a panel's title.
     * @property {Function} createTimer - Method to create a timer for periodic updates.
     * @property {Function} highlightComponent - Method to highlight a component for attention.
     * @property {Function} updatePanelColor - Method to update panel background color.
     */

    /**
     * Creates a new overlay window with customizable options
     * 
     * @param {Object} options - Configuration options for the window
     * @param {string} options.id - Unique identifier for the window
     * @param {string} options.title - Title of the window
     * @param {Object} [options.colorScheme] - Color scheme to use (defaults to DARK)
     * @param {number} [options.width=300] - Width of the window
     * @param {number} [options.height=200] - Height of the window
     * @param {number} [options.x=50] - Initial X position of the window
     * @param {number} [options.y=50] - Initial Y position of the window
     * @param {boolean} [options.closable=true] - Whether the window has a close button
     * @param {boolean} [options.resizable=false] - Whether the window is resizable
     * @param {boolean} [options.draggable=true] - Whether the window is draggable
     * @param {Function} [options.onClose] - Callback function when window is closed
     * @returns {Object} Created window object with methods for manipulation
     */
    static createWindow(options) {
        if (!options || !options.id) {
            throw new Error("Window ID is required");
        }

        if (this.windows[options.id]) {
            return this.windows[options.id];
        }

        const id = options.id;
        const title = options.title || "DeadZone Overlay";
        const colorScheme = options.colorScheme || this.ColorSchemes.DARK;
        const width = options.width || 300;
        const height = options.height || 200;
        const x = options.x || 50;
        const y = options.y || 50;
        const closable = options.closable !== false;
        const resizable = options.resizable === true;
        const draggable = options.draggable !== false;
        const onClose = options.onClose || function () { };

        const frame = new JFrame(title);
        frame.setUndecorated(true);
        frame.setAlwaysOnTop(true);
        frame.setBackground(new Color(0, 0, 0, 0));

        const mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout());
        mainPanel.setBackground(colorScheme.background);
        mainPanel.setBorder(BorderFactory.createLineBorder(colorScheme.border, 1));

        const headerPanel = new JPanel();
        headerPanel.setLayout(new BorderLayout());
        headerPanel.setBackground(colorScheme.headerBackground);
        headerPanel.setBorder(BorderFactory.createEmptyBorder(5, 10, 5, 10));

        const titleLabel = new JLabel(title);
        titleLabel.setForeground(colorScheme.text);
        titleLabel.setFont(new Font("Dialog", Font.BOLD, 12));
        headerPanel.add(titleLabel, BorderLayout.WEST);

        if (closable) {
            const closeButton = new JLabel("X");
            closeButton.setForeground(colorScheme.text);
            closeButton.setFont(new Font("Dialog", Font.BOLD, 12));

            const closeButtonListener = Java.extend(MouseAdapter, {
                mouseClicked: function (e) {
                    frame.setVisible(false);
                    onClose();
                }
            });
            closeButton.addMouseListener(new closeButtonListener());
            headerPanel.add(closeButton, BorderLayout.EAST);
        }

        if (draggable) {
            let dragStartX = 0;
            let dragStartY = 0;

            const headerDragListener = Java.extend(MouseAdapter, {
                mousePressed: function (e) {
                    dragStartX = e.getX();
                    dragStartY = e.getY();
                },
                mouseDragged: function (e) {
                    const currentLocation = frame.getLocation();
                    frame.setLocation(
                        currentLocation.x + e.getX() - dragStartX,
                        currentLocation.y + e.getY() - dragStartY
                    );
                }
            });
            headerPanel.addMouseListener(new headerDragListener());
            headerPanel.addMouseMotionListener(new headerDragListener());
        }

        const contentPanel = new JPanel();
        contentPanel.setLayout(new BorderLayout());
        contentPanel.setBackground(colorScheme.panelBackground);
        contentPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        mainPanel.add(headerPanel, BorderLayout.NORTH);
        mainPanel.add(contentPanel, BorderLayout.CENTER);
        frame.add(mainPanel);

        frame.setPreferredSize(new Dimension(width, height));
        frame.pack();
        frame.setLocation(new PointJ(x, y));

        if (resizable) {
            const resizeCornerSize = 15;
            const resizeCorner = new JPanel();
            resizeCorner.setPreferredSize(new Dimension(resizeCornerSize, resizeCornerSize));
            resizeCorner.setBackground(new Color(0, 0, 0, 0));
            resizeCorner.setCursor(Java.type("java.awt.Cursor").getPredefinedCursor(Java.type("java.awt.Cursor").SE_RESIZE_CURSOR));

            const resizeListener = Java.extend(MouseAdapter, {
                mousePressed: function (e) {
                    dragStartX = e.getXOnScreen();
                    dragStartY = e.getYOnScreen();
                },
                mouseDragged: function (e) {
                    const deltaX = e.getXOnScreen() - dragStartX;
                    const deltaY = e.getYOnScreen() - dragStartY;

                    const newWidth = Math.max(100, frame.getWidth() + deltaX);
                    const newHeight = Math.max(100, frame.getHeight() + deltaY);

                    frame.setSize(newWidth, newHeight);
                    dragStartX = e.getXOnScreen();
                    dragStartY = e.getYOnScreen();
                }
            });
            resizeCorner.addMouseListener(new resizeListener());
            resizeCorner.addMouseMotionListener(new resizeListener());

            mainPanel.add(resizeCorner, BorderLayout.SOUTHEAST);
        }

        const windowObj = {
            id,
            frame,
            mainPanel,
            headerPanel,
            contentPanel,
            titleLabel,
            colorScheme,
            panels: {},
            components: {},
            timers: [],

            show: function () {
                SwingUtilities.invokeLater(function () {
                    frame.setVisible(true);
                });
                return this;
            },

            hide: function () {
                SwingUtilities.invokeLater(function () {
                    frame.setVisible(false);
                });
                return this;
            },

            toggle: function () {
                SwingUtilities.invokeLater(function () {
                    frame.setVisible(!frame.isVisible());
                });
                return this;
            },

            dispose: function () {
                this.timers.forEach(timer => {
                    if (timer && timer.isRunning()) {
                        timer.stop();
                    }
                });

                SwingUtilities.invokeLater(function () {
                    frame.dispose();
                });

                delete SwingUtils.windows[id];
                return this;
            },

            /**
             * Sets the window title
             * @param {string} newTitle - New window title
             */
            setTitle: function (newTitle) {
                SwingUtilities.invokeLater(function () {
                    titleLabel.setText(newTitle);
                });
                return this;
            },

            /**
             * Creates a panel in the window's content area
             * @param {Object} panelOptions - Panel configuration
             * @param {string} panelOptions.id - Unique identifier for the panel
             * @param {string} [panelOptions.title] - Optional title for the panel
             * @param {string} [panelOptions.layout="grid"] - Layout type: "border", "flow", "grid"
             * @param {Object} [panelOptions.layoutOptions] - Layout-specific options
             * @param {string} [panelOptions.position="center"] - Position in parent (for BorderLayout)
             * @param {Object} [panelOptions.parent] - Parent panel ID or null for main content
             * @returns {JPanel} Created panel
             */
            createPanel: function (panelOptions) {
                const panelId = panelOptions.id;
                const panelTitle = panelOptions.title;
                const layoutType = panelOptions.layout || "grid";
                const layoutOptions = panelOptions.layoutOptions || {};
                const position = panelOptions.position || BorderLayout.CENTER;
                const parentId = panelOptions.parent;

                const panel = new JPanel();

                if (layoutType === "border") {
                    panel.setLayout(new BorderLayout(
                        layoutOptions.hgap || 0,
                        layoutOptions.vgap || 0
                    ));
                } else if (layoutType === "flow") {
                    panel.setLayout(new FlowLayout(
                        layoutOptions.align || FlowLayout.CENTER,
                        layoutOptions.hgap || 5,
                        layoutOptions.vgap || 5
                    ));
                } else if (layoutType === "grid") {
                    panel.setLayout(new GridLayout(
                        layoutOptions.rows || 1,
                        layoutOptions.cols || 1,
                        layoutOptions.hgap || 2,
                        layoutOptions.vgap || 2
                    ));
                } else if (layoutType === "gridbag") {
                    panel.setLayout(new GridBagLayout());
                }

                panel.setBackground(new Color(
                    colorScheme.panelBackground.getRed(),
                    colorScheme.panelBackground.getGreen(),
                    colorScheme.panelBackground.getBlue(),
                    colorScheme.panelBackground.getAlpha()
                ));

                if (panelTitle) {
                    const titledBorder = BorderFactory.createTitledBorder(
                        BorderFactory.createLineBorder(colorScheme.border, 1),
                        panelTitle,
                        TitledBorder.CENTER,
                        TitledBorder.TOP,
                        new Font("Dialog", Font.BOLD, 11),
                        colorScheme.text
                    );
                    panel.setBorder(BorderFactory.createCompoundBorder(
                        titledBorder,
                        BorderFactory.createEmptyBorder(5, 5, 5, 5)
                    ));
                } else {
                    panel.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
                }

                if (parentId && this.panels[parentId]) {
                    this.panels[parentId].add(panel, position);
                } else {
                    this.contentPanel.add(panel, position);
                }

                this.panels[panelId] = panel;

                return panel;
            },

            /**
             * Creates a label in a panel
             * @param {Object} labelOptions - Label configuration
             * @param {string} labelOptions.id - Unique identifier for the label
             * @param {string} labelOptions.text - Label text
             * @param {string} labelOptions.panel - Parent panel ID
             * @param {string} [labelOptions.position=""] - Position in parent (for BorderLayout)
             * @param {Object} [labelOptions.font] - Font options
             * @param {Color} [labelOptions.color] - Text color
             * @param {number} [labelOptions.align=SwingConstants.LEFT] - Text alignment
             * @returns {JLabel} Created label
             */
            createLabel: function (labelOptions) {
                const labelId = labelOptions.id;
                const text = labelOptions.text || "";
                const panelId = labelOptions.panel;
                const position = labelOptions.position || "";
                const fontOptions = labelOptions.font || {};
                const color = labelOptions.color || colorScheme.text;
                const align = labelOptions.align || SwingConstants.LEFT;

                const label = new JLabel(text, align);
                label.setForeground(color);

                const fontFamily = fontOptions.family || "Dialog";
                const fontStyle = fontOptions.style || Font.PLAIN;
                const fontSize = fontOptions.size || 11;
                label.setFont(new Font(fontFamily, fontStyle, fontSize));

                if (this.panels[panelId]) {
                    if (this.panels[panelId].getLayout() instanceof BorderLayout) {
                        this.panels[panelId].add(label, position);
                    } else {
                        this.panels[panelId].add(label);
                    }
                }

                this.components[labelId] = label;

                return label;
            },

            /**
             * Creates a button in a panel
             * @param {Object} buttonOptions - Button configuration
             * @param {string} buttonOptions.id - Unique identifier for the button
             * @param {string} buttonOptions.text - Button text
             * @param {string} buttonOptions.panel - Parent panel ID
             * @param {string} [buttonOptions.position=""] - Position in parent (for BorderLayout)
             * @param {Function} [buttonOptions.onClick] - Click event handler
             * @returns {JButton} Created button
             */
            createButton: function (buttonOptions) {
                const buttonId = buttonOptions.id;
                const text = buttonOptions.text || "Button";
                const panelId = buttonOptions.panel;
                const position = buttonOptions.position || "";
                const onClick = buttonOptions.onClick || function () { };

                const button = new JButton(text);

                const actionListener = Java.extend(ActionListener, {
                    actionPerformed: function (e) {
                        try {
                            onClick(e);
                        } catch (err) {
                            console.error("Error in button click handler: " + err.message);
                        }
                    }
                });
                button.addActionListener(new actionListener());

                if (this.panels[panelId]) {
                    if (this.panels[panelId].getLayout() instanceof BorderLayout) {
                        this.panels[panelId].add(button, position);
                    } else {
                        this.panels[panelId].add(button);
                    }
                }

                this.components[buttonId] = button;

                return button;
            },

            /**
             * Creates a checkbox in a panel
             * @param {Object} checkboxOptions - Checkbox configuration
             * @param {string} checkboxOptions.id - Unique identifier for the checkbox
             * @param {string} checkboxOptions.text - Checkbox text
             * @param {string} checkboxOptions.panel - Parent panel ID
             * @param {boolean} [checkboxOptions.selected=false] - Initial selection state
             * @param {Function} [checkboxOptions.onChange] - Change event handler
             * @returns {JCheckBox} Created checkbox
             */
            createCheckbox: function (checkboxOptions) {
                const checkboxId = checkboxOptions.id;
                const text = checkboxOptions.text || "";
                const panelId = checkboxOptions.panel;
                const selected = checkboxOptions.selected || false;
                const onChange = checkboxOptions.onChange || function () { };

                const checkbox = new JCheckBox(text, selected);
                checkbox.setForeground(colorScheme.text);
                checkbox.setBackground(new Color(0, 0, 0, 0));

                const actionListener = Java.extend(ActionListener, {
                    actionPerformed: function (e) {
                        try {
                            onChange(checkbox.isSelected());
                        } catch (err) {
                            console.error("Error in checkbox change handler: " + err.message);
                        }
                    }
                });
                checkbox.addActionListener(new actionListener());

                if (this.panels[panelId]) {
                    this.panels[panelId].add(checkbox);
                }

                this.components[checkboxId] = checkbox;

                return checkbox;
            },

            /**
             * Creates a dropdown (combo box) in a panel
             * @param {Object} comboOptions - Combo box configuration
             * @param {string} comboOptions.id - Unique identifier for the combo box
             * @param {Array} comboOptions.items - Array of items to display
             * @param {string} comboOptions.panel - Parent panel ID
             * @param {number} [comboOptions.selected=0] - Initial selected index
             * @param {Function} [comboOptions.onChange] - Change event handler
             * @returns {JComboBox} Created combo box
             */
            createComboBox: function (comboOptions) {
                const comboId = comboOptions.id;
                const items = comboOptions.items || [];
                const panelId = comboOptions.panel;
                const selected = comboOptions.selected || 0;
                const onChange = comboOptions.onChange || function () { };

                const combo = new JComboBox();

                items.forEach(item => {
                    combo.addItem(item);
                });

                if (selected >= 0 && selected < items.length) {
                    combo.setSelectedIndex(selected);
                }

                const actionListener = Java.extend(ActionListener, {
                    actionPerformed: function (e) {
                        try {
                            onChange(combo.getSelectedItem(), combo.getSelectedIndex());
                        } catch (err) {
                            console.error("Error in combo box change handler: " + err.message);
                        }
                    }
                });
                combo.addActionListener(new actionListener());

                if (this.panels[panelId]) {
                    this.panels[panelId].add(combo);
                }

                this.components[comboId] = combo;

                return combo;
            },

            /**
             * Creates a progress bar in a panel
             * @param {Object} progressOptions - Progress bar configuration
             * @param {string} progressOptions.id - Unique identifier for the progress bar
             * @param {string} progressOptions.panel - Parent panel ID
             * @param {number} [progressOptions.min=0] - Minimum value
             * @param {number} [progressOptions.max=100] - Maximum value
             * @param {number} [progressOptions.value=0] - Initial value
             * @param {boolean} [progressOptions.showText=true] - Whether to show progress text
             * @returns {JProgressBar} Created progress bar
             */
            createProgressBar: function (progressOptions) {
                const progressId = progressOptions.id;
                const panelId = progressOptions.panel;
                const min = progressOptions.min || 0;
                const max = progressOptions.max || 100;
                const value = progressOptions.value || 0;
                const showText = progressOptions.showText !== false;

                const progressBar = new JProgressBar(min, max);
                progressBar.setValue(value);
                progressBar.setStringPainted(showText);

                if (this.panels[panelId]) {
                    this.panels[panelId].add(progressBar);
                }

                this.components[progressId] = progressBar;

                return progressBar;
            },

            /**
             * Creates a text area in a panel
             * @param {Object} textAreaOptions - Text area configuration
             * @param {string} textAreaOptions.id - Unique identifier for the text area
             * @param {string} textAreaOptions.panel - Parent panel ID
             * @param {string} [textAreaOptions.text=""] - Initial text
             * @param {number} [textAreaOptions.rows=5] - Number of rows
             * @param {number} [textAreaOptions.cols=20] - Number of columns
             * @param {boolean} [textAreaOptions.editable=true] - Whether the text area is editable
             * @param {boolean} [textAreaOptions.scrollable=true] - Whether to add scroll bars
             * @returns {JTextArea|JScrollPane} Created text area or scroll pane containing text area
             */
            createTextArea: function (textAreaOptions) {
                const textAreaId = textAreaOptions.id;
                const panelId = textAreaOptions.panel;
                const text = textAreaOptions.text || "";
                const rows = textAreaOptions.rows || 5;
                const cols = textAreaOptions.cols || 20;
                const editable = textAreaOptions.editable !== false;
                const scrollable = textAreaOptions.scrollable !== false;

                const textArea = new JTextArea(text, rows, cols);
                textArea.setEditable(editable);
                textArea.setForeground(colorScheme.text);
                textArea.setBackground(new Color(
                    colorScheme.background.getRed(),
                    colorScheme.background.getGreen(),
                    colorScheme.background.getBlue(),
                    230
                ));

                let component;
                if (scrollable) {
                    component = new JScrollPane(textArea);
                    component.setPreferredSize(new Dimension(cols * 8, rows * 16));
                } else {
                    component = textArea;
                }

                if (this.panels[panelId]) {
                    this.panels[panelId].add(component);
                }

                this.components[textAreaId] = textArea;

                return component;
            },

            /**
             * Creates a separator in a panel
             * @param {Object} separatorOptions - Separator configuration
             * @param {string} separatorOptions.id - Unique identifier for the separator
             * @param {string} separatorOptions.panel - Parent panel ID
             * @param {boolean} [separatorOptions.horizontal=true] - Orientation
             * @returns {JSeparator} Created separator
             */
            createSeparator: function (separatorOptions) {
                const separatorId = separatorOptions.id;
                const panelId = separatorOptions.panel;
                const horizontal = separatorOptions.horizontal !== false;

                const orientation = horizontal ? JSeparator.HORIZONTAL : JSeparator.VERTICAL;
                const separator = new JSeparator(orientation);

                if (this.panels[panelId]) {
                    this.panels[panelId].add(separator);
                }

                this.components[separatorId] = separator;

                return separator;
            },

            /**
             * Updates a component's text or value
             * @param {string} id - Component ID
             * @param {*} value - New value (text for labels, selection for checkboxes, etc.)
             */
            updateComponent: function (id, value) {
                const component = this.components[id];
                if (!component) return;

                SwingUtilities.invokeLater(function () {
                    try {
                        if (component instanceof JLabel) {
                            component.setText(String(value));
                        } else if (component instanceof JButton) {
                            component.setText(String(value));
                        } else if (component instanceof JCheckBox) {
                            component.setSelected(Boolean(value));
                        } else if (component instanceof JProgressBar) {
                            component.setValue(Number(value));
                        } else if (component instanceof JTextArea) {
                            component.setText(String(value));
                        } else if (component instanceof JComboBox) {
                            if (typeof value === "number") {
                                component.setSelectedIndex(value);
                            } else {
                                component.setSelectedItem(value);
                            }
                        }
                    } catch (err) {
                        console.error("Error updating component: " + err.message);
                    }
                });

                return this;
            },

            /**
             * Updates a panel's title
             * @param {string} id - Panel ID
             * @param {string} title - New title
             */
            updatePanelTitle: function (id, title) {
                const panel = this.panels[id];
                if (!panel) return;

                SwingUtilities.invokeLater(function () {
                    try {
                        const border = panel.getBorder();
                        if (border instanceof TitledBorder) {
                            border.setTitle(title);
                            panel.repaint();
                        }
                    } catch (err) {
                        console.error("Error updating panel title: " + err.message);
                    }
                });

                return this;
            },

            /**
             * Creates a timer for periodic updates
             * @param {Object} timerOptions - Timer configuration
             * @param {number} timerOptions.interval - Update interval in milliseconds
             * @param {Function} timerOptions.callback - Callback function for updates
             * @param {boolean} [timerOptions.autoStart=true] - Whether to auto-start the timer
             * @returns {Timer} Created timer
             */
            createTimer: function (timerOptions) {
                const interval = timerOptions.interval || 1000;
                const callback = timerOptions.callback || function () { };
                const autoStart = timerOptions.autoStart !== false;

                const timerListener = Java.extend(ActionListener, {
                    actionPerformed: function (e) {
                        try {
                            callback();
                        } catch (err) {
                            console.error("Error in timer callback: " + err.message);
                        }
                    }
                });

                const timer = new Timer(interval, new timerListener());

                this.timers.push(timer);

                if (autoStart) {
                    timer.start();
                }

                return timer;
            },

            /**
             * Highlight a component for attention
             * @param {string} id - Component ID
             * @param {Color} [color] - Highlight color (defaults to accent color)
             * @param {number} [duration=1000] - Duration in milliseconds
             */
            highlightComponent: function (id, color, duration) {
                const component = this.components[id];
                if (!component) return;

                const highlightColor = color || colorScheme.accent;
                const highlightDuration = duration || 1000;
                const originalBackground = component.getBackground();

                SwingUtilities.invokeLater(function () {
                    component.setBackground(highlightColor);

                    const timer = new Timer(highlightDuration, new Java.extend(ActionListener, {
                        actionPerformed: function (e) {
                            component.setBackground(originalBackground);
                            timer.stop();
                        }
                    }));
                    timer.setRepeats(false);
                    timer.start();
                });

                return this;
            },

            /**
             * Updates panel background color
             * @param {string} id - Panel ID
             * @param {Color} color - New background color
             */
            updatePanelColor: function (id, color) {
                const panel = this.panels[id];
                if (!panel) return;

                SwingUtilities.invokeLater(function () {
                    panel.setBackground(color);
                    panel.repaint();
                });

                return this;
            }
        };

        this.windows[id] = windowObj;

        return windowObj;
    }

    /**
     * Retrieves a window by its ID
     * @param {string} id - Window ID
     * @returns {Object|null} Window object or null if not found
     */
    static getWindow(id) {
        return this.windows[id] || null;
    }

    /**
     * Closes and disposes all windows
     */
    static closeAll() {
        Object.values(this.windows).forEach(window => {
            try {
                window.dispose();
            } catch (e) {
                console.error("Error disposing window: " + e.message);
            }
        });
    }

    /**
     * Creates a debug information window
     * @param {Object} options - Configuration options
     * @param {string} [options.id="debug-window"] - Window ID
     * @param {string} [options.title="Debug Info"] - Window title
     * @param {Object} [options.colorScheme] - Color scheme (defaults to DEBUG)
     * @param {Function} [options.logHandler] - Handler for adding log entries
     * @returns {Object} Created window object
     */
    static createDebugWindow(options = {}) {
        const id = options.id || "debug-window";
        const title = options.title || "Debug Info";
        const colorScheme = options.colorScheme || this.ColorSchemes.DEBUG;

        const window = this.createWindow({
            id: id,
            title: title,
            colorScheme: colorScheme,
            width: 500,
            height: 400,
            closable: true,
            draggable: true,
            resizable: true
        });

        const controlPanel = window.createPanel({
            id: "controls",
            layout: "flow",
            position: BorderLayout.NORTH
        });

        window.createButton({
            id: "clear-btn",
            text: "Clear Log",
            panel: "controls",
            onClick: function () {
                window.updateComponent("log-area", "");
            }
        });

        window.createCheckbox({
            id: "auto-scroll",
            text: "Auto-scroll",
            panel: "controls",
            selected: true
        });

        const logPanel = window.createPanel({
            id: "log-panel",
            title: "Log Output",
            layout: "border",
            position: BorderLayout.CENTER
        });

        const logArea = window.createTextArea({
            id: "log-area",
            panel: "log-panel",
            text: "",
            rows: 20,
            cols: 50,
            editable: false,
            scrollable: true
        });

        const statusPanel = window.createPanel({
            id: "status-panel",
            layout: "flow",
            position: BorderLayout.SOUTH
        });

        window.createLabel({
            id: "status-label",
            text: "Ready",
            panel: "status-panel"
        });

        window.log = function (message, type = "INFO") {
            const logArea = window.components["log-area"];
            if (!logArea) return;

            const timestamp = new Date().toLocaleTimeString();
            const logEntry = `[${timestamp}] [${type}] ${message}\n`;

            SwingUtilities.invokeLater(function () {
                const currentText = logArea.getText();
                logArea.setText(currentText + logEntry);

                if (window.components["auto-scroll"] && window.components["auto-scroll"].isSelected()) {
                    logArea.setCaretPosition(logArea.getDocument().getLength());
                }

                window.updateComponent("status-label", `Last entry: ${timestamp}`);
            });

            return window;
        };

        window.show();

        return window;
    }

    /**
     * Creates a grid-based data display window
     * @param {Object} options - Configuration options
     * @param {string} [options.id="data-window"] - Window ID
     * @param {string} [options.title="Data Display"] - Window title
     * @param {Object} [options.colorScheme] - Color scheme (defaults to DARK)
     * @param {Array} [options.columns] - Column definitions [{id, name, width}]
     * @param {Array} [options.rows] - Initial data rows
     * @param {Function} [options.updateCallback] - Callback for updating data
     * @returns {Object} Created window object
     */
    static createDataWindow(options = {}) {
        const id = options.id || "data-window";
        const title = options.title || "Data Display";
        const colorScheme = options.colorScheme || this.ColorSchemes.DARK;
        const columns = options.columns || [{ id: "col1", name: "Column 1", width: 100 }];
        const rows = options.rows || [];
        const updateCallback = options.updateCallback || function () { return []; };

        const window = this.createWindow({
            id: id,
            title: title,
            colorScheme: colorScheme,
            width: Math.max(300, columns.reduce((sum, col) => sum + (col.width || 100), 0) + 40),
            height: 300,
            closable: true,
            draggable: true,
            resizable: true
        });

        const headerPanel = window.createPanel({
            id: "header-panel",
            layout: "grid",
            layoutOptions: { rows: 1, cols: columns.length },
            position: BorderLayout.NORTH
        });

        columns.forEach((column, index) => {
            window.createLabel({
                id: `header-${column.id}`,
                text: column.name || `Column ${index + 1}`,
                panel: "header-panel",
                font: { family: "Dialog", style: Font.BOLD, size: 12 }
            });
        });

        const dataPanel = window.createPanel({
            id: "data-panel",
            layout: "grid",
            layoutOptions: { rows: Math.max(10, rows.length), cols: columns.length, vgap: 1 },
            position: BorderLayout.CENTER
        });

        for (let rowIndex = 0; rowIndex < Math.max(10, rows.length); rowIndex++) {
            const rowData = rows[rowIndex] || {};

            columns.forEach((column, colIndex) => {
                const cellId = `cell-${rowIndex}-${column.id}`;
                const cellValue = rowData[column.id] || "";

                window.createLabel({
                    id: cellId,
                    text: cellValue,
                    panel: "data-panel"
                });
            });
        }

        window.createTimer({
            interval: 1000,
            callback: function () {
                try {
                    const updatedRows = updateCallback() || [];

                    updatedRows.forEach((rowData, rowIndex) => {
                        if (rowIndex >= Math.max(10, rows.length)) return;

                        columns.forEach((column) => {
                            const cellId = `cell-${rowIndex}-${column.id}`;
                            const cellValue = rowData[column.id] || "";

                            window.updateComponent(cellId, cellValue);
                        });
                    });
                } catch (err) {
                    console.error("Error updating data window: " + err.message);
                }
            }
        });

        window.show();

        return window;
    }
}

// Store all created windows for management
SwingUtils.windows = {};
// Color Schemes
SwingUtils.ColorSchemes = {
    DARK: {
        background: new Color(30, 30, 30, 180),
        headerBackground: new Color(40, 40, 40, 220),
        panelBackground: new Color(35, 35, 35, 200),
        accent: new Color(70, 130, 180),
        text: Color.WHITE,
        border: new Color(60, 60, 60)
    },
    LIGHT: {
        background: new Color(240, 240, 240, 180),
        headerBackground: new Color(220, 220, 220, 220),
        panelBackground: new Color(230, 230, 230, 200),
        accent: new Color(70, 130, 180),
        text: Color.BLACK,
        border: new Color(180, 180, 180)
    },
    DEBUG: {
        background: new Color(20, 30, 20, 180),
        headerBackground: new Color(30, 50, 30, 220),
        panelBackground: new Color(25, 35, 25, 200),
        accent: new Color(70, 180, 70),
        text: Color.WHITE,
        border: new Color(40, 100, 40)
    },
    DATA: {
        background: new Color(20, 20, 30, 180),
        headerBackground: new Color(30, 30, 50, 220),
        panelBackground: new Color(25, 25, 35, 200),
        accent: new Color(100, 100, 180),
        text: Color.WHITE,
        border: new Color(60, 60, 100)
    }
};
