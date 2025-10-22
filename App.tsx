import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
// NOTE: Ensure you have installed a vector icon library (e.g., '@expo/vector-icons' or 'react-native-vector-icons')
import { Ionicons } from '@expo/vector-icons'; 

// ====================================================================
//                             1. CONSTANTS & TYPES
// ====================================================================

const { height, width } = Dimensions.get('window');

// Colors based on user request and image observation
const COLORS = {
  APP_BACKGROUND: '#122025',      // Main app background
  SCROLL_FLATLIST_BG: '#09161b',  // ScrollView/FlatList background
  MODAL_BAR_BG: '#09191B',        // Modal inputs/bars background (as requested: #09191B)
  DIVIDER_LINE: '#000000',        // Black line divider
  TEXT_LIGHT: '#FFFFFF',
  TEXT_MUTED: '#B0B0B0',
  BUTTON_RED: '#E31C25',          // Used for SAVE/DELETE/Modal Save
  BUTTON_GRAY: '#404040',         // Used for CLEAR ALL/Modal Close button
  SELECTED_CARD: '#1E2D35',       // Slightly darker shade for the card background
};

// Placeholder for the App Logo image - REPLACE WITH YOUR ACTUAL PATH
const AppLogo = require('./assets/snack-icon.png'); 

// Predefined Courses (used for decoy and picker)
const COURSES = [
  { name: 'Orektíá', avgPrice: 24, id: 'c1' }, // Starters
  { name: 'Soúpa', avgPrice: 28, id: 'c2' }, // Soup
  { name: 'Próta Piáto', avgPrice: 37, id: 'c3' }, // First Plate/Main
  { name: 'Saláta', avgPrice: 30, id: 'c4' }, // Salad
];

const LANGUAGES = [
  { code: 'el', name: 'Ελληνικά' }, // Greek
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'Arabic' },
];

// Type Definitions
interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
}

interface NewItemForm {
  name: string;
  description: string;
  course: string;
  price: string;
}

// Initial Decoy Data 
const INITIAL_MENU_ITEMS: MenuItem[] = [
  { id: 'd1', name: 'Kefedakia', description: 'Spiced meatballs with lemon and herbs.', course: 'Orektíá', price: 15.00 },
  { id: 'd2', name: 'Saganaki', description: 'Fried kefalotyri cheese, golden and crispy.', course: 'Orektíá', price: 12.50 },
  { id: 'd3', name: 'Fasolada', description: 'White bean soup with tomato and olive oil.', course: 'Soúpa', price: 10.00 },
];


// ====================================================================
//                             2. MAIN COMPONENT LOGIC
// ====================================================================

const CombinedScreen: React.FC = () => {
  // --- State Variables ---
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
  const [newItem, setNewItem] = useState<NewItemForm>({
    name: '',
    description: '',
    course: COURSES[0].name,
    price: '',
  });

  // --- Handlers ---
  const handleAddItem = useCallback(() => {
    if (!newItem.name || !newItem.description || !newItem.course || !newItem.price) {
      Alert.alert('Missing Info', 'Please fill in all fields (Name, Description, Price, Course).');
      return;
    }
    const price = parseFloat(newItem.price);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Invalid Price', 'Price must be a valid number greater than zero.');
      return;
    }

    // Add new item to the top
    const newMenuItem: MenuItem = { id: Math.random().toString(), name: newItem.name, description: newItem.description, course: newItem.course, price: price };
    setMenuItems(prev => [newMenuItem, ...prev]); 

    // Reset form and close modal
    setNewItem({ name: '', description: '', course: COURSES[0].name, price: '' });
    setIsModalVisible(false);
  }, [newItem]);

  const handleSaveEdit = useCallback(() => {
    if (selectedItem) {
      Alert.alert('Save', `Item "${selectedItem.name}" saved (Placeholder for edit logic).`);
      setSelectedItem(null);
    }
  }, [selectedItem]);

  const handleDeleteItem = useCallback(() => {
    if (selectedItem) {
      setMenuItems(prev => prev.filter(item => item.id !== selectedItem.id));
      setSelectedItem(null);
      Alert.alert('Deleted', `Item "${selectedItem.name}" deleted.`);
    }
  }, [selectedItem]);

  const handleClearAll = useCallback(() => {
    setMenuItems([]);
    setSelectedItem(null);
    Alert.alert('Cleared', 'All items have been removed from the menu list.');
  }, []);

  const handleTranslatorSelect = (lang: { name: string }) => {
    Alert.alert('Translator', `App language set to ${lang.name}.`);
    setIsTranslatorOpen(false);
  };

  // --- Sub-Components ---
  const renderManagementItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={[
        styles.menuItemCard,
        selectedItem?.id === item.id && styles.selectedCard,
      ]}
      onPress={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.cardTitle}>{item.name} <Text style={styles.cardPrice}>€{item.price.toFixed(2)}</Text></Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
        <Image source={AppLogo} style={styles.cardImage} />
      </View>

      {/* Action Buttons (Visible only when selected) */}
      {selectedItem?.id === item.id && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
            <Text style={styles.buttonText}>SAVE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteItem}>
            <Text style={styles.buttonText}>DELETE</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  // --- JSX Rendering ---
  return (
    <View style={styles.container}>
      
      {/* ---------------- HOME SCREEN SECTION ---------------- */}
      <View style={styles.homeScreen}>
        
        {/* Translator Icon and Dropdown */}
        <TouchableOpacity style={styles.translatorIcon} onPress={() => setIsTranslatorOpen(prev => !prev)}>
          <Ionicons name="language" size={24} color={COLORS.TEXT_LIGHT} />
        </TouchableOpacity>

        {isTranslatorOpen && (
          <View style={styles.translatorDropdown}>
            {LANGUAGES.map(lang => (
              <TouchableOpacity key={lang.code} onPress={() => handleTranslatorSelect(lang)}>
                <Text style={styles.translatorText}>{lang.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* App Name and Logo */}
        <View style={styles.header}>
          <Text style={styles.appName1}>Fengarófotis</Text>
          <View style={styles.appTitleRow}>
            <Text style={styles.appName2}>Psichés</Text>
            <Image source={AppLogo} style={styles.logo} />
          </View>
        </View>

        {/* Horizontal ScrollView (Decoy Courses) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.courseScrollView}
          contentContainerStyle={styles.courseScrollViewContent}
        >
          {COURSES.map(course => (
            <View key={course.id} style={styles.coursePill}>
              <Text style={styles.courseName}>{course.name}</Text>
              <Text style={styles.coursePrice}>€{course.avgPrice}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Home Screen Menu FlatList */}
        <FlatList
          data={menuItems}
          keyExtractor={item => item.id}
          style={styles.homeFlatList}
          renderItem={({ item }) => (
            <View style={styles.homeMenuItem}>
              <View style={styles.homeItemRow}>
                <Image source={AppLogo} style={styles.homeItemImage} />
                <View style={styles.homeItemText}>
                  <Text style={styles.homeItemName}>{item.name}</Text>
                  <Text style={styles.homeItemDescription}>{item.description}</Text>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={<Text style={styles.totalItemsText}>Prepared Items: {menuItems.length}</Text>}
        />
      </View>

      {/* HORIZONTAL BLACK DIVIDER LINE */}
      <View style={styles.divider} />

      {/* ---------------- MENU MANAGEMENT SECTION ---------------- */}
      <View style={styles.menuManagementScreen}>
        <Text style={styles.managementTitle}>Menu Management</Text>
        
        {/* Disabled Search Bar (as requested) */}
        <View style={styles.disabledSearchBar}>
          <Ionicons name="search" size={20} color={COLORS.TEXT_MUTED} />
          <Text style={styles.disabledSearchText}>Search Item (Disabled)</Text>
        </View>

        {/* Add New Item Button (opens modal) */}
        <TouchableOpacity
          style={styles.addNewItemButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.addNewItemText}>Add Menu Item</Text>
          <Ionicons name="add" size={24} color={COLORS.TEXT_LIGHT} />
        </TouchableOpacity>

        {/* Menu Management FlatList */}
        <FlatList
          data={menuItems}
          keyExtractor={item => item.id}
          renderItem={renderManagementItem}
          style={styles.menuFlatList}
          contentContainerStyle={{ paddingBottom: 10 }}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No items. Add items above.</Text>
          }
        />

        {/* Clear All Button */}
        <TouchableOpacity style={styles.clearAllButton} onPress={handleClearAll}>
          <Text style={styles.buttonText}>CLEAR ALL</Text>
        </TouchableOpacity>
      </View>

      {/* ---------------- FLOATING MODAL SCREEN (Add New Item) ---------------- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {/* Modal Header */}
            <View style={styles.modalHeaderBar}>
              <Text style={styles.modalHeaderTitle}>Add New Menu Item</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                 <Ionicons name="close-circle-outline" size={30} color={COLORS.TEXT_LIGHT} />
              </TouchableOpacity>
            </View>

            {/* Form Inputs */}
            <View style={styles.modalFormContainer}>
              <TextInput
                style={styles.modalInput}
                placeholder="Item Name"
                placeholderTextColor={COLORS.TEXT_MUTED}
                value={newItem.name}
                onChangeText={text => setNewItem(prev => ({ ...prev, name: text }))}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Description"
                placeholderTextColor={COLORS.TEXT_MUTED}
                value={newItem.description}
                onChangeText={text => setNewItem(prev => ({ ...prev, description: text }))}
              />
              
              {/* Course Picker (Horizontal ScrollView as Picker) */}
              <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>Course:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {COURSES.map(course => (
                          <TouchableOpacity
                              key={course.id}
                              style={[
                                  styles.pickerButton,
                                  newItem.course === course.name && styles.pickerButtonSelected,
                              ]}
                              onPress={() => setNewItem(prev => ({ ...prev, course: course.name }))}
                          >
                              <Text style={styles.pickerButtonText}>{course.name}</Text>
                          </TouchableOpacity>
                      ))}
                  </ScrollView>
              </View>

              <TextInput
                style={styles.modalInput}
                placeholder="Price"
                placeholderTextColor={COLORS.TEXT_MUTED}
                keyboardType="numeric"
                value={newItem.price}
                onChangeText={text => setNewItem(prev => ({ ...prev, price: text.replace(/[^0-9.]/g, '') }))}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.modalSaveButton} onPress={handleAddItem}>
              <Text style={styles.buttonText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ====================================================================
//                             3. STYLESHEET
// ====================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_BACKGROUND,
  },

  // --- Home Screen Styles ---
  homeScreen: {
    flex: 1.5,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  translatorIcon: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  translatorDropdown: {
    position: 'absolute',
    top: 75,
    left: 10,
    backgroundColor: COLORS.MODAL_BAR_BG,
    borderRadius: 5,
    padding: 5,
    zIndex: 20,
  },
  translatorText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 14,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  appName1: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 28,
    fontStyle: 'italic',
  },
  appTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName2: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 10,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  courseScrollView: {
    maxHeight: 50,
    marginBottom: 10,
  },
  courseScrollViewContent: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  coursePill: {
    backgroundColor: COLORS.SCROLL_FLATLIST_BG,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 10,
    flexDirection: 'row',
  },
  courseName: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
    fontSize: 13,
  },
  coursePrice: {
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
    marginLeft: 5,
  },
  homeFlatList: {
    flex: 1,
    backgroundColor: COLORS.SCROLL_FLATLIST_BG,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  homeMenuItem: {
    marginBottom: 15,
  },
  homeItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  homeItemImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#304048',
  },
  homeItemText: {
    flex: 1,
  },
  homeItemName: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeItemDescription: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    marginTop: 4,
  },
  totalItemsText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#253540',
  },

  // --- Horizontal Divider ---
  divider: {
    height: 2,
    backgroundColor: COLORS.DIVIDER_LINE,
  },

  // --- Menu Management Styles ---
  menuManagementScreen: {
    flex: 1.5,
    padding: 20,
    paddingTop: 10,
  },
  managementTitle: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  disabledSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SCROLL_FLATLIST_BG,
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    opacity: 0.5,
  },
  disabledSearchText: {
    color: COLORS.TEXT_MUTED,
    marginLeft: 10,
  },
  addNewItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.SCROLL_FLATLIST_BG,
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  addNewItemText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
    fontSize: 16,
  },
  menuFlatList: {
    flex: 1,
    backgroundColor: COLORS.SCROLL_FLATLIST_BG,
    borderRadius: 8,
    padding: 10,
  },
  menuItemCard: {
    backgroundColor: COLORS.SELECTED_CARD, 
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: COLORS.BUTTON_RED,
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'normal',
    color: COLORS.TEXT_MUTED,
  },
  cardDescription: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    marginTop: 5,
    width: width * 0.5,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    resizeMode: 'contain',
    backgroundColor: '#304048',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#253540',
    paddingTop: 10,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: COLORS.BUTTON_RED,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: COLORS.BUTTON_RED,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
    fontSize: 12,
  },
  clearAllButton: {
    backgroundColor: COLORS.BUTTON_GRAY,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  emptyListText: {
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    padding: 20,
  },

  // --- Modal (Float Screen) Styles ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 32, 37, 0.9)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.APP_BACKGROUND,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.MODAL_BAR_BG,
    elevation: 20,
    overflow: 'hidden',
  },
  modalHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.MODAL_BAR_BG,
    padding: 15,
  },
  modalHeaderTitle: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalFormContainer: {
    padding: 20,
  },
  modalInput: {
    backgroundColor: COLORS.MODAL_BAR_BG,
    borderRadius: 5,
    color: COLORS.TEXT_LIGHT,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.MODAL_BAR_BG,
    borderRadius: 5,
  },
  pickerLabel: {
    color: COLORS.TEXT_MUTED,
    fontSize: 14,
    marginBottom: 5,
    paddingHorizontal: 15,
  },
  pickerButton: {
    backgroundColor: COLORS.APP_BACKGROUND, 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  pickerButtonSelected: {
    backgroundColor: COLORS.BUTTON_RED,
  },
  pickerButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 14,
  },
  modalSaveButton: {
    backgroundColor: COLORS.BUTTON_RED,
    padding: 18,
    alignItems: 'center',
  },
});

// Final export for the single TSX file
export default CombinedScreen;