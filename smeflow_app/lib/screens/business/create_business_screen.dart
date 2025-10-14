import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/category_provider.dart';
import '../../services/business_service.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_textfield.dart';

class CreateBusinessScreen extends StatefulWidget {
  const CreateBusinessScreen({super.key});

  @override
  State<CreateBusinessScreen> createState() => _CreateBusinessScreenState();
}

class _CreateBusinessScreenState extends State<CreateBusinessScreen> {
  final _formKey = GlobalKey<FormState>();
  final _businessNameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _websiteController = TextEditingController();
  final _addressController = TextEditingController();

  String? _selectedCategory;
  String _selectedCounty = 'Nairobi';
  bool _isLoading = false;

  final List<String> _kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
    'Kitale', 'Garissa', 'Kakamega', 'Meru', 'Nyeri', 'Machakos', 'Kericho',
    'Embu', 'Migori', 'Homa Bay', 'Naivasha', 'Kilifi', 'Bungoma'
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final categoryProvider = context.read<CategoryProvider>();
      if (categoryProvider.categories.isEmpty) {
        categoryProvider.loadCategories();
      }
    });
  }

  @override
  void dispose() {
    _businessNameController.dispose();
    _descriptionController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _websiteController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _submitBusiness() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCategory == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a category')),
      );
      return;
    }

    setState(() => _isLoading = true);

    final businessService = BusinessService();
    final result = await businessService.createBusiness({
      'businessName': _businessNameController.text.trim(),
      'description': _descriptionController.text.trim(),
      'category': _selectedCategory,
      'county': _selectedCounty,
      'contactEmail': _emailController.text.trim(),
      'contactPhone': _phoneController.text.trim(),
      'website': _websiteController.text.trim().isNotEmpty ? _websiteController.text.trim() : null,
      'location': {
        'type': 'Point',
        'coordinates': [-1.2921, 36.8219], // Default Nairobi coordinates
        'address': _addressController.text.trim(),
      },
    });

    setState(() => _isLoading = false);

    if (mounted) {
      if (result['success']) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Business created successfully! Pending verification.'),
            backgroundColor: AppTheme.primaryGreen,
          ),
        );
        Navigator.of(context).pop();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result['error'] ?? 'Failed to create business'),
            backgroundColor: AppTheme.primaryRed,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Your Business'),
        backgroundColor: Colors.white,
        foregroundColor: AppTheme.textPrimary,
        elevation: 0,
      ),
      body: Container(
        decoration: AppTheme.cityscapeGradient(2),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Info card
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryGreen.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.primaryGreen.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.info_outline, color: AppTheme.primaryGreen),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Your business will be reviewed before being published',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Business Name
                CustomTextField(
                  label: 'Business Name',
                  hint: 'e.g., Mama Jane\'s Restaurant',
                  controller: _businessNameController,
                  prefixIcon: Icons.store,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter business name';
                    }
                    if (value.length < 3) {
                      return 'Name must be at least 3 characters';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 20),

                // Description
                CustomTextField(
                  label: 'Description',
                  hint: 'Describe your business and what you offer',
                  controller: _descriptionController,
                  prefixIcon: Icons.description,
                  maxLines: 4,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a description';
                    }
                    if (value.length < 20) {
                      return 'Description must be at least 20 characters';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 20),

                // Category
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Category',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textPrimary,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Consumer<CategoryProvider>(
                      builder: (context, categoryProvider, child) {
                        if (categoryProvider.isLoading) {
                          return const LinearProgressIndicator();
                        }

                        return DropdownButtonFormField<String>(
                          value: _selectedCategory,
                          decoration: const InputDecoration(
                            prefixIcon: Icon(Icons.category),
                          ),
                          hint: const Text('Select a category'),
                          items: categoryProvider.categories.map((category) {
                            return DropdownMenuItem(
                              value: category.id,
                              child: Text(category.name),
                            );
                          }).toList(),
                          onChanged: (value) {
                            setState(() => _selectedCategory = value);
                          },
                          validator: (value) {
                            if (value == null) {
                              return 'Please select a category';
                            }
                            return null;
                          },
                        );
                      },
                    ),
                  ],
                ),

                const SizedBox(height: 20),

                // County
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'County',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textPrimary,
                          ),
                    ),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: _selectedCounty,
                      decoration: const InputDecoration(
                        prefixIcon: Icon(Icons.location_on),
                      ),
                      items: _kenyanCounties.map((county) {
                        return DropdownMenuItem(
                          value: county,
                          child: Text(county),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() => _selectedCounty = value!);
                      },
                    ),
                  ],
                ),

                const SizedBox(height: 20),

                // Address
                CustomTextField(
                  label: 'Physical Address',
                  hint: 'e.g., Tom Mboya Street, Nairobi',
                  controller: _addressController,
                  prefixIcon: Icons.location_city,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your address';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 20),

                // Email
                CustomTextField(
                  label: 'Business Email',
                  hint: 'contact@business.com',
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  prefixIcon: Icons.email,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter email';
                    }
                    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                        .hasMatch(value)) {
                      return 'Please enter a valid email';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 20),

                // Phone
                CustomTextField(
                  label: 'Business Phone',
                  hint: '+254712345678',
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  prefixIcon: Icons.phone,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter phone number';
                    }
                    if (!RegExp(r'^\+254[17]\d{8}$').hasMatch(value)) {
                      return 'Enter valid Kenyan number (+254...)';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 20),

                // Website (optional)
                CustomTextField(
                  label: 'Website (Optional)',
                  hint: 'https://yourbusiness.com',
                  controller: _websiteController,
                  keyboardType: TextInputType.url,
                  prefixIcon: Icons.language,
                ),

                const SizedBox(height: 32),

                // Submit button
                CustomButton(
                  text: 'Create Business',
                  onPressed: _submitBusiness,
                  isLoading: _isLoading,
                ),

                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
