import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/app_theme.dart';
import '../../providers/tender_provider.dart';
import '../../providers/category_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_textfield.dart';
import '../../config/kenya_counties.dart';

class PostTenderScreen extends StatefulWidget {
  const PostTenderScreen({super.key});

  @override
  State<PostTenderScreen> createState() => _PostTenderScreenState();
}

class _PostTenderScreenState extends State<PostTenderScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _budgetMinController = TextEditingController();
  final _budgetMaxController = TextEditingController();
  final _requirementController = TextEditingController();

  String? _selectedCategory;
  String? _selectedCounty;
  DateTime? _deadline;
  final List<String> _requirements = [];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CategoryProvider>().loadCategories();
    });
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _budgetMinController.dispose();
    _budgetMaxController.dispose();
    _requirementController.dispose();
    super.dispose();
  }

  Future<void> _selectDeadline() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 7)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() {
        _deadline = picked;
      });
    }
  }

  void _addRequirement() {
    if (_requirementController.text.trim().isNotEmpty) {
      setState(() {
        _requirements.add(_requirementController.text.trim());
        _requirementController.clear();
      });
    }
  }

  Future<void> _submitTender() async {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedCategory == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a category'),
          backgroundColor: AppTheme.primaryRed,
        ),
      );
      return;
    }

    if (_selectedCounty == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a county'),
          backgroundColor: AppTheme.primaryRed,
        ),
      );
      return;
    }

    if (_deadline == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a deadline'),
          backgroundColor: AppTheme.primaryRed,
        ),
      );
      return;
    }

    final tenderProvider = context.read<TenderProvider>();
    final success = await tenderProvider.createTender(
      title: _titleController.text.trim(),
      description: _descriptionController.text.trim(),
      category: _selectedCategory!,
      budgetMin: double.parse(_budgetMinController.text),
      budgetMax: double.parse(_budgetMaxController.text),
      deadline: _deadline!,
      county: _selectedCounty!,
      requirements: _requirements,
    );

    if (mounted) {
      if (success) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('🎉 Tender posted successfully! SMEs and Brokers can now submit bids.'),
            backgroundColor: AppTheme.primaryGreen,
            duration: Duration(seconds: 4),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(tenderProvider.error ?? 'Failed to post tender'),
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
        title: const Text('Post Tender'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CustomTextField(
                label: 'Tender Title',
                hint: 'e.g., Website Development Project',
                controller: _titleController,
                prefixIcon: Icons.title,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter tender title';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              CustomTextField(
                label: 'Description',
                hint: 'Describe what you need...',
                controller: _descriptionController,
                prefixIcon: Icons.description,
                maxLines: 4,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter description';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Category dropdown
              Consumer<CategoryProvider>(
                builder: (context, categoryProvider, child) {
                  return DropdownButtonFormField<String>(
                    value: _selectedCategory,
                    decoration: const InputDecoration(
                      labelText: 'Category',
                      prefixIcon: Icon(Icons.category),
                    ),
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
                      if (value == null) return 'Please select category';
                      return null;
                    },
                  );
                },
              ),
              const SizedBox(height: 16),

              // County dropdown
              DropdownButtonFormField<String>(
                value: _selectedCounty,
                decoration: const InputDecoration(
                  labelText: 'County',
                  prefixIcon: Icon(Icons.location_on),
                ),
                items: KenyaCounties.all.map((county) {
                  return DropdownMenuItem(
                    value: county,
                    child: Text(county),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() => _selectedCounty = value);
                },
                validator: (value) {
                  if (value == null) return 'Please select county';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Budget fields
              Row(
                children: [
                  Expanded(
                    child: CustomTextField(
                      label: 'Min Budget (KES)',
                      hint: '50000',
                      controller: _budgetMinController,
                      prefixIcon: Icons.attach_money,
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Required';
                        }
                        if (double.tryParse(value) == null) {
                          return 'Invalid';
                        }
                        return null;
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: CustomTextField(
                      label: 'Max Budget (KES)',
                      hint: '100000',
                      controller: _budgetMaxController,
                      prefixIcon: Icons.attach_money,
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Required';
                        }
                        final max = double.tryParse(value);
                        final min = double.tryParse(_budgetMinController.text);
                        if (max == null) return 'Invalid';
                        if (min != null && max < min) {
                          return 'Must be > min';
                        }
                        return null;
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Deadline
              InkWell(
                onTap: _selectDeadline,
                child: InputDecorator(
                  decoration: const InputDecoration(
                    labelText: 'Deadline',
                    prefixIcon: Icon(Icons.calendar_today),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        _deadline != null
                            ? '${_deadline!.day}/${_deadline!.month}/${_deadline!.year}'
                            : 'Select deadline',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const Icon(Icons.arrow_drop_down),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Requirements section
              Text(
                'Requirements',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _requirementController,
                      decoration: const InputDecoration(
                        hintText: 'Add a requirement',
                        border: OutlineInputBorder(),
                      ),
                      onSubmitted: (_) => _addRequirement(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    onPressed: _addRequirement,
                    icon: const Icon(Icons.add),
                    style: IconButton.styleFrom(
                      backgroundColor: AppTheme.primaryGreen,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              if (_requirements.isNotEmpty)
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.background,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: _requirements.asMap().entries.map((entry) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          children: [
                            const Text('• '),
                            Expanded(child: Text(entry.value)),
                            IconButton(
                              icon: const Icon(Icons.close, size: 18),
                              onPressed: () {
                                setState(() {
                                  _requirements.removeAt(entry.key);
                                });
                              },
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),

              const SizedBox(height: 32),

              Consumer<TenderProvider>(
                builder: (context, tenderProvider, child) {
                  return CustomButton(
                    text: 'Post Tender',
                    onPressed: _submitTender,
                    isLoading: tenderProvider.isLoading,
                  );
                },
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
